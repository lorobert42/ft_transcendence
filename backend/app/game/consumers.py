
import datetime
import json
import time
import random
import asyncio
from datetime import datetime, timezone
from asyncio import CancelledError
from core.models import Game ,Tournament, User
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from .game import GameClass, Ball, Paddle
from .tournament import TournamentClass
from icecream import ic

""" Define for move of the paddle. """
KEY_P1_UP, KEY_P1_DOWN, KEY_P2_UP, KEY_P2_DOWN = 1, 2, 3, 4
WIDTH, HEIGHT = 1000, 700  # Game size

class GameRoomConsumer(AsyncWebsocketConsumer):
    game_tab = dict()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.save_ball_x = 0
        self.save_ball_y = 0

    """ All the management of the websocket. """
    async def connect(self):
        """ Comportement of the websocket when created. """
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.game_room_group = 'game_%s' % self.room_id
        self.user = await self.get_user(self.scope['user'].id)
        await self.update_player_status(self.user.id, True)
        try :
            room_id = int(self.room_id)
            self.game_type = "online"
            self.game = await self.get_game(room_id)
        except:
            self.game_type = "local"

        await self.channel_layer.group_add(
            self.game_room_group,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, message):
        """ Comportement of the websocket when disconnect. """
        await self.update_player_status(self.user.id, False)
        if self.game_type == "online":
            await self.game_canceled(self.game.id)
        if self.room_id in GameRoomConsumer.game_tab:
            """ Stop the task if still running"""
            if GameRoomConsumer.game_tab[self.room_id].task is not None:
                if not GameRoomConsumer.game_tab[self.room_id].task.done() \
                and self.game_type == "local":
                    GameRoomConsumer.game_tab[self.room_id].task.cancel()
                try:
                    await GameRoomConsumer.game_tab[self.room_id].task
                except CancelledError:
                    print("Game have been canceled")

            """ discard the game in dict if exist"""
            if GameRoomConsumer.game_tab[self.room_id].p1['name'] == self.user.email:
                if GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'local' \
                or GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'bot' \
                or GameRoomConsumer.game_tab[self.room_id].p2['state'] == False:
                    GameRoomConsumer.game_tab.pop(self.room_id)
                else:
                    if self.game_type == "online":
                        GameRoomConsumer.game_tab[self.room_id].p1['state'] = False
            elif GameRoomConsumer.game_tab[self.room_id].p2['name'] == self.user.email:
                if GameRoomConsumer.game_tab[self.room_id].p1['name'] == 'bot' \
                or GameRoomConsumer.game_tab[self.room_id].p1['state'] == False:
                    GameRoomConsumer.game_tab.pop(self.room_id)
                else:
                    if self.game_type == "online":
                        GameRoomConsumer.game_tab[self.room_id].p2['state'] = False

        await self.channel_layer.group_discard(
            self.game_room_group,
            self.channel_name,
        )

    async def receive(self, text_data):
        """ Comportement of the class when a certain message is send from the frontend. """
        td_json = json.loads(text_data)
        if 'join' in td_json:
            player_1_type = td_json.get('player_1_type', 'human')
            player_2_type = td_json.get('player_2_type', 'human')
            # If there's no game instance, create one with the specified player types
            if GameRoomConsumer.game_tab.get(self.room_id) == None:
                GameRoomConsumer.game_tab[self.room_id] = GameClass(self.room_id, asyncio.Lock(), player_1_type, player_2_type)
            game_instance = GameRoomConsumer.game_tab[self.room_id]
            if game_instance.p1_type == 'bot':
                GameRoomConsumer.game_tab[self.room_id].p1['name'] = "bot"
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
            elif game_instance.p2_type == 'bot':
                GameRoomConsumer.game_tab[self.room_id].p2['name'] = "bot"
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = True
            await self.add_user(td_json['join'])
        elif 'local' in td_json:
            game_instance = GameRoomConsumer.game_tab[self.room_id]
            player_1_type = td_json.get('player_1_type', 'human')
            player_2_type = td_json.get('player_2_type', 'human')

            if ((td_json['local'] == 'P1_UP' or td_json['local'] == 'P1_DOWN') and game_instance.p1_type != 'bot'):
                await self.handle_move_local(td_json['local'])
            elif ((td_json['local'] == 'P2_UP' or td_json['local'] == 'P2_DOWN') and game_instance.p2_type != 'bot'):
                await self.handle_move_local(td_json['local'])
        elif 'move' in td_json:
            await self.handle_move_online(td_json['move'])
        elif 'start' in td_json and not GameRoomConsumer.game_tab[self.room_id].active:
            await self.handle_start(td_json['start'])
        # If player is a bot initialize and mark as ready

    async def handle_move_online(self, move):
        if self.user.email == GameRoomConsumer.game_tab[self.room_id].p1['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P1_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P1_DOWN)
        elif self.user.email == GameRoomConsumer.game_tab[self.room_id].p2['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P2_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P2_DOWN)

    async def add_user(self, mode):
        if mode == "online":
            if await self.get_current_player_pos(self.game.id, self.user.id) == 1:
                GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.user.email
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
                await self.update_player_status_in_game(1, "playing", self.room_id)
            else:
                GameRoomConsumer.game_tab[self.room_id].p2['name'] = self.user.email
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = True
                await self.update_player_status_in_game(2, "playing", self.room_id)
        else:
            GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.user.email
            GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
            GameRoomConsumer.game_tab[self.room_id].p2['name'] = "local"
            GameRoomConsumer.game_tab[self.room_id].p2['state'] = True

    async def handle_move_local(self, message):
        if message == "P1_UP":
            await self.handle_paddle_move(KEY_P1_UP)
        elif message == "P1_DOWN":
            await self.handle_paddle_move(KEY_P1_DOWN)
        elif message == "P2_UP":
            await self.handle_paddle_move(KEY_P2_UP)
        elif message == "P2_DOWN":
            await self.handle_paddle_move(KEY_P2_DOWN)

    async def handle_start(self, message):
        if message == "start":
            if GameRoomConsumer.game_tab[self.room_id].p1['state'] == True and GameRoomConsumer.game_tab[self.room_id].p2['state'] == True:
                GameRoomConsumer.game_tab[self.room_id].active = True
                if self.game_type == "online":
                    await self.update_game_running("running", self.game.id)
                GameRoomConsumer.game_tab[self.room_id].task = asyncio.create_task(self.loop(
                GameRoomConsumer.game_tab[self.room_id].max_score
                ))

    async def handle_paddle_move(self, key):
        """Function that will move the paddle in function of the key pressed"""
        left = GameRoomConsumer.game_tab[self.room_id].paddle_l
        right = GameRoomConsumer.game_tab[self.room_id].paddle_r
        if key is KEY_P1_UP and left.y - left.vel >= 0:
            GameRoomConsumer.game_tab[self.room_id].paddle_l.move(up=True)
        elif key is KEY_P1_DOWN and left.y + left.vel + left.height <= HEIGHT:
            GameRoomConsumer.game_tab[self.room_id].paddle_l.move(up=False)
        elif key is KEY_P2_UP and right.y - right.vel >= 0:
            GameRoomConsumer.game_tab[self.room_id].paddle_r.move(up=True)
        elif key is KEY_P2_DOWN and right.y + right.vel + right.height <= HEIGHT:
            GameRoomConsumer.game_tab[self.room_id].paddle_r.move(up=False)

    async def loop(self, max_score):
        self.hit_paddle = False
        self.reset_game = True
        self.hit_ceiling = False
        """ Main loop that will run the Game. """
        self.start_time = time.time()
        if self.game_type == "online":
            await self.countdown()
        while GameRoomConsumer.game_tab[self.room_id].active:
            if self.reset_game == True or self.hit_paddle == True:
                #print("hit paddle: ", self.hit_paddle)
                #print("hit reset_game: ", self.reset_game)
                end_time = time.time()
                elapsed_time = end_time - self.start_time
                #print("Time: ", elapsed_time)
                self.start_time = time.time()
                self.observation = self.get_observation()  # Update observation
                self.reset_game = False
                self.hit_paddle = False
            else:
                self.observation[0] = (self.save_ball_x + self.observation[2]) / WIDTH
                self.observation[1] = (self.save_ball_y + self.observation[3]) / HEIGHT
                self.save_ball_x = self.observation[0] * WIDTH
                self.save_ball_y = self.observation[1] * HEIGHT
                if self.hit_ceiling == True:
                    self.observation[3] = -self.observation[3]
                    self.hit_ceiling = False

            # Decide action for player 1 if bot
            if GameRoomConsumer.game_tab[self.room_id].p1_type == 'bot':
                action = self.decide_bot_action('left', self.observation)
                await self.handle_paddle_move(action)
                if (action == KEY_P1_UP):
                    self.observation[5] -= (10 / HEIGHT)
                elif (action == KEY_P1_DOWN):
                    self.observation[5] += (10 / HEIGHT)
            # Decide action for player 2 if bot
            if GameRoomConsumer.game_tab[self.room_id].p2_type == 'bot':
                action = self.decide_bot_action('right', self.observation)
                await self.handle_paddle_move(action)
                if (action == KEY_P2_UP):
                    self.observation[4] -= (10 / HEIGHT)
                elif (action == KEY_P2_DOWN):
                    self.observation[4] += (10 / HEIGHT)

            if GameRoomConsumer.game_tab[self.room_id].score_p1 < GameRoomConsumer.game_tab[self.room_id].max_score \
            and GameRoomConsumer.game_tab[self.room_id].score_p2 < GameRoomConsumer.game_tab[self.room_id].max_score:
                """ Game logic """
                GameRoomConsumer.game_tab[self.room_id].ball.move()
                ball = GameRoomConsumer.game_tab[self.room_id].ball
                left = GameRoomConsumer.game_tab[self.room_id].paddle_l
                right = GameRoomConsumer.game_tab[self.room_id].paddle_r
                if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad <= 0: # Ball hit the ceiling
                    GameRoomConsumer.game_tab[self.room_id].ball.y_vel *= -1
                    self.hit_ceiling = True
                # Cheking the direction of the ball
                elif ball.x_vel < 0:
                    # Ball goes right to left <-
                    if ball.y >= left.y and ball.y <= left.y + left.height and ball.x - ball.rad <= left.x + left.width:
                        # Ball is hitting the left_paddle
                        GameRoomConsumer.game_tab[self.room_id].ball.x_vel *= -1
                        middle_y = left.y + left.height / 2
                        difference_in_y = middle_y - ball.y
                        reduction_factor = (left.height / 2) / ball.max_vel_y
                        y_vel = difference_in_y / reduction_factor
                        GameRoomConsumer.game_tab[self.room_id].ball.y_vel = -1 * y_vel
                        # Will change the velocity of the ball depending of where the
                        # Ball is hitting the paddle
                        self.hit_paddle = True
                else:
                    # Ball goes left to right ->
                    if ball.y >= right.y and ball.y <= right.y + right.height and ball.x + ball.rad >= right.x:
                        # Ball is hitting the rigth_paddle
                        GameRoomConsumer.game_tab[self.room_id].ball.x_vel *= -1
                        middle_y = right.y + right.height / 2
                        difference_in_y = middle_y - ball.y
                        reduction_factor = (right.height / 2) / ball.max_vel_y
                        y_vel = difference_in_y / reduction_factor
                        GameRoomConsumer.game_tab[self.room_id].ball.y_vel = -1 * y_vel
                        # Will change the velocity of the ball depending of where the
                        # Ball is hitting the paddle
                        self.hit_paddle = True
                if ball.x <= 0: # right have scored so P2 won a point
                    GameRoomConsumer.game_tab[self.room_id].score_p2 += 1
                    GameRoomConsumer.game_tab[self.room_id].ball.reset()
                    self.reset_game = True
                    self.start_time = time.time()
                elif ball.x >= WIDTH: # left have scored so P1 won a point
                    GameRoomConsumer.game_tab[self.room_id].score_p1 += 1
                    GameRoomConsumer.game_tab[self.room_id].ball.reset()
                    self.reset_game = True
                    self.start_time = time.time()
                """ Getting data to send to the front """
                data = {
                    "P1": GameRoomConsumer.game_tab[self.room_id].paddle_l.pos(),
                    "P2": GameRoomConsumer.game_tab[self.room_id].paddle_r.pos(),
                    "Ball": GameRoomConsumer.game_tab[self.room_id].ball.pos(),
                    "P1 Score": GameRoomConsumer.game_tab[self.room_id].score_p1,
                    "P2 Score": GameRoomConsumer.game_tab[self.room_id].score_p2,
                }
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_state",
                        "state": data,
                    }
                )
                await asyncio.sleep(0.01)
            else:
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_end",
                        "message": "Game Ended",
                    }
                )
                GameRoomConsumer.game_tab[self.room_id].active = False
        if self.game_type == "online":
            await self.update_game_finish(
                GameRoomConsumer.game_tab[self.room_id].score_p1,
                GameRoomConsumer.game_tab[self.room_id].score_p2,
                "finished",
                self.game.id
            )
            await self.update_player_status(self.user.id, False)

    def get_observation(self):
        self.save_ball_y = GameRoomConsumer.game_tab[self.room_id].ball.y
        self.save_ball_x = GameRoomConsumer.game_tab[self.room_id].ball.x
        observation = [GameRoomConsumer.game_tab[self.room_id].ball.x / WIDTH,
                       GameRoomConsumer.game_tab[self.room_id].ball.y / HEIGHT,
                       GameRoomConsumer.game_tab[self.room_id].ball.x_vel,
                       GameRoomConsumer.game_tab[self.room_id].ball.y_vel,
                       GameRoomConsumer.game_tab[self.room_id].paddle_r.y / HEIGHT,
                       GameRoomConsumer.game_tab[self.room_id].paddle_l.y / HEIGHT]
        return (observation)

    def decide_bot_action(self, side, observation):
        random_number = random.uniform(0.03, 0.15)
        if (side == "right"):
            if (observation[2] < 0): # Ball goes to the opposite side
                # recenter the paddle
                if (observation[4] + random_number) * HEIGHT < HEIGHT / 2:
                    return KEY_P2_DOWN
                elif (observation[4] + random_number) * HEIGHT > HEIGHT / 2:
                    return KEY_P2_UP
                #return None
            if observation[1] - random_number < observation[4]:
                return KEY_P2_UP
            elif observation[1] - random_number > observation[4]:
                return KEY_P2_DOWN
            return None
        elif (side == "left"):
            if (observation[2] > 0):
                # recenter the paddle
                if (observation[5] + random_number) * HEIGHT < HEIGHT / 2:
                    return KEY_P1_DOWN
                elif (observation[5] + random_number) * HEIGHT > HEIGHT / 2:
                    return KEY_P1_UP
                #return None
            if observation[1] - random_number < observation[5]:
                return KEY_P1_UP
            elif observation[1] - random_number > observation[5]:
                return KEY_P1_DOWN
            return None

    async def countdown(self):
        for count in range(5, 0, -1):
            await self.channel_layer.group_send(
                self.game_room_group,
                {
                    "type": "send_countdown",
                    "countdown": count,
                }
            )
            await asyncio.sleep(1)
            ic(f"sleep one sec: {count}")
        pass

    async def send_countdown(self, countdown):
        """ Function that send state of the curent game. """
        countdown = countdown['countdown']
        await self.send(text_data=json.dumps(countdown))

    async def send_state(self, event):
        """ Function that send state of the curent game. """
        state = event['state']
        await self.send(text_data=json.dumps(state))

    async def send_end(self, event):
        """ Function that a message to the front when the game haas ended. """
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def print_game(self, id, message):
        game = Game.objects.get(pk=id)
        ic(message)
        ic(game.player1_status)
        ic(game.player2_status)
        ic(game.game_status)

    @database_sync_to_async
    def game_canceled(self, game_id):
        game = Game.objects.get(pk=game_id)
        if (game.player1_status == "pending" or game.player2_status == "pending") \
        and game.tournament is None and game.game_status == "pending":
            game.game_status = "canceled"
            game.save()

    @database_sync_to_async
    def update_player_status(self, user_id, status):
        user = User.objects.get(pk=user_id)
        user.is_playing = status
        user.save()

    @database_sync_to_async
    def update_game_running(self, status, id):
        game = Game.objects.get(pk=id)
        game.game_status = status
        game.save()

    @database_sync_to_async
    def update_game_finish(self, score1, score2, status, game_id):
        game = Game.objects.get(pk=game_id)
        game.score1 = score1
        game.score2 = score2
        game.game_status = status
        game.save()

    @database_sync_to_async
    def update_player_status_in_game(self, player, status, id):
        game = Game.objects.get(pk=id)
        if player == 1:
            game.player1_status = status
        elif player == 2:
            game.player2_status = status
        game.save()

    @database_sync_to_async
    def get_user(self, id):
        user = User.objects.get(pk=id)
        return user

    @database_sync_to_async
    def get_game(self, id):
        game = Game.objects.get(pk=id)
        return game

    @database_sync_to_async
    def get_current_player_pos(self, id, user_id):
        game = Game.objects.get(pk=id)
        if game.player1.id == user_id:
            return 1
        if game.player2.id == user_id:
            return 2

""" ### Tournament Consumer ### """
class TournamentConsumer(AsyncWebsocketConsumer):
    tournament_tab = dict()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        """ Comportement of the websocket when created. """
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.tournament_group = 'game_%s' % self.room_id

        if TournamentConsumer.tournament_tab.get(self.room_id) == None:
            TournamentConsumer.tournament_tab[self.room_id] = TournamentClass()
            TournamentConsumer.tournament_tab[self.room_id].task = asyncio.create_task(self.loop())

        await self.channel_layer.group_add(
            self.tournament_group,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, message):
        if TournamentConsumer.tournament_tab[self.room_id].task.done():
            try:
                await TournamentConsumer.tournament_tab[self.room_id].task
            except CancelledError:
                print("task waiting error")
            TournamentConsumer.tournament_tab.pop(self.room_id)
        await self.channel_layer.group_discard(
            self.tournament_group,
            self.channel_name,
        )

    async def loop(self):
        loop = True
        time_game = dict()
        loop_count = 0
        max_time = 5
        await self.start_tournament(int(self.room_id))
        while loop:
            loop_count += 1
            tab = await self.get_games(int(self.room_id))
            participants = await self.get_participants(int(self.room_id))
            await self.send_data(tab)
            count = 0
            now = time.time()
            for i in range(0, len(tab)):
                if tab[i]['player1'] is not None and tab[i]['player2'] is not None \
                and tab[i]['game'].game_status == "pending":
                    if time_game.get(i) is None:
                        time_game[i] = time.time()
                    if time_game[i] < now and (now -  time_game[i]) % 3600 // 60 >= max_time:
                        await self.cancel_current_game(tab[i]['game'].id, "canceled")
                        await self.set_winner_rand(tab[i], tab[i]['game'].tournamentRound, tab[i]['game'].roundGame)
                elif tab[i]['game'].game_status == "finished":
                    await self.set_winner(tab[i], tab[i]['game'].tournamentRound, tab[i]['game'].roundGame)
                if tab[i]['player1'] is None:
                    tab[i]['player1'] = await self.get_winner(1 ,tab[i]['game'].tournamentRound, tab[i]['game'].roundGame, participants)
                    if tab[i]['player1'] is not None:
                        await self.update_player(tab[i]['game'].id, tab[i]['player1'].id, 1)
                if tab[i]['player2'] is None:
                    tab[i]['player2'] = await self.get_winner(2 ,tab[i]['game'].tournamentRound, tab[i]['game'].roundGame, participants)
                    if tab[i]['player2'] is not None:
                        await self.update_player(tab[i]['game'].id, tab[i]['player2'].id, 2)
                elif tab[i]['game'].game_status == "finished" or tab[i]['game'].game_status == "canceled":
                    count += 1
            await asyncio.sleep(2)
            if count == len(tab):
                ic("loop ended")
                if await self.is_last_game_canceled(tab, int(self.room_id), participants) == False:
                    await self.finish_tournament(int(self.room_id))
                ic("tournament set as finished")
                loop = False

    async def is_last_game_canceled(self, tab, tournament_id, participants):
        for i in range(0, len(tab)):
            if participants > 4:
                if tab[i]['game'].tournamentRound == 3 and tab[i]['game'].roundGame == 1:
                    if tab[i]['game'].game_status == "canceled":
                        await self.cancel_tournament(tournament_id)
                        return True
            else:
                if tab[i]['game'].tournamentRound == 2 and tab[i]['game'].roundGame == 1:
                    if tab[i]['game'].game_status == "canceled":
                        await self.cancel_tournament(tournament_id)
                        return True
        return False

    async def send_data(self, tab):
        data = dict()
        for i in range(0, len(tab)):
            key = f"{tab[i]['game'].tournamentRound},{tab[i]['game'].roundGame}"
            data.update({
                key: {
                'game_id': tab[i]['game'].id,
                'player1': tab[i]['player1'].name if tab[i]['player1'] is not None else None,
                'player2': tab[i]['player2'].name if tab[i]['player2'] is not None else None,
                'score1': tab[i]['game'].score1,
                'score2': tab[i]['game'].score2,
                'status': tab[i]['game'].game_status,
                }
             })
        await self.channel_layer.group_send(
            self.tournament_group,
            {
                "type": "send_state",
                "state": data,
            }
        )

    async def ic_winer(self):
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r1g1)
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r1g2)
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r1g3)
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r1g4)
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r2g1)
        ic(TournamentConsumer.tournament_tab[self.room_id].winner_r2g2)

    async def get_winner(self, player, round, game, participants):
        if player == 1 and round == 2 and game == 1:
            return TournamentConsumer.tournament_tab[self.room_id].winner_r1g1
        if player == 2 and round == 2 and game == 1:
            return TournamentConsumer.tournament_tab[self.room_id].winner_r1g2
        if player == 1 and round == 2 and game == 2:
            return TournamentConsumer.tournament_tab[self.room_id].winner_r1g3
        if player == 2 and round == 2 and game == 2:
            return TournamentConsumer.tournament_tab[self.room_id].winner_r1g4
        if player == 1 and round == 3 and game == 1:
            return TournamentConsumer.tournament_tab[self.room_id].winner_r2g1
        if player == 2 and round == 3 and game == 1:
            if participants < 7:
                return TournamentConsumer.tournament_tab[self.room_id].winner_r1g3
            else:
                return TournamentConsumer.tournament_tab[self.room_id].winner_r2g2

    async def set_winner(self, tab, round, game):
        if round == 1 and game == 1:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g1 = await self.winner(tab)
        elif round == 1 and game == 2:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g2 = await self.winner(tab)
        elif round == 1 and game == 3:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g3 = await self.winner(tab)
        elif round == 1 and game == 4:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g4 = await self.winner(tab)
        elif round == 2 and game == 1:
            TournamentConsumer.tournament_tab[self.room_id].winner_r2g1 = await self.winner(tab)
        elif round == 2 and game == 2:
            TournamentConsumer.tournament_tab[self.room_id].winner_r2g2 = await self.winner(tab)

    async def winner(self, tab):
        if tab['game'].score1 > tab['game'].score2:
            return tab['player1']
        else:
            return tab['player2']

    async def set_winner_rand(self, tab, round, game):
        if round == 1 and game == 1:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g1 = await self.winner_random(tab)
        elif round == 1 and game == 2:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g2 = await self.winner_random(tab)
        elif round == 1 and game == 3:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g3 = await self.winner_random(tab)
        elif round == 1 and game == 4:
            TournamentConsumer.tournament_tab[self.room_id].winner_r1g4 = await self.winner_random(tab)
        elif round == 2 and game == 1:
            TournamentConsumer.tournament_tab[self.room_id].winner_r2g1 = await self.winner_random(tab)
        elif round == 2 and game == 2:
            TournamentConsumer.tournament_tab[self.room_id].winner_r2g2 = await self.winner_random(tab)

    async def winner_random(self, tab):
        random.seed(time.time())
        if tab['game'].player1_status == "playing":
            return tab['player1']
        elif tab['game'].player2_status == "playing":
            return tab['player2']
        elif random.randint(1, 2) == 1:
            return tab['player1']
        else:
            return tab['player2']

    async def send_state(self, event):
        """ Function that send state of the curent game. """
        state = event['state']
        await self.send(text_data=json.dumps(state))

    @database_sync_to_async
    def cancel_current_game(self, game_id, status):
        game = Game.objects.get(pk=1)
        game.game_status = status
        game.save()

    @database_sync_to_async
    def start_tournament(self, tournament_id):
        tournament = Tournament.objects.get(pk=tournament_id)
        tournament.status = "running"
        tournament.save()

    @database_sync_to_async
    def cancel_tournament(self, tournament_id):
        tournament = Tournament.objects.get(pk=tournament_id)
        tournament.status = "canceled"
        tournament.save()

    @database_sync_to_async
    def finish_tournament(self, tournament_id):
        tournament = Tournament.objects.get(pk=tournament_id)
        tournament.status = "finished"
        tournament.save()

    @database_sync_to_async
    def update_player(self, game_id, player_id, player_pos):
        game = Game.objects.get(pk=game_id)
        player = User.objects.get(pk=player_id)
        if player_pos == 1:
            game.player1 = player
            game.save()
        else:
            game.player2 = player
            game.save()

    @database_sync_to_async
    def get_games(self, tournament_id):
        games = Game.objects.all()
        users = User.objects.all()
        tab = []
        for i in range(0, games.count()):
            if games[i].tournament is not None:
                if games[i].tournament.id == tournament_id:
                    player1 = None
                    player2 = None
                    if games[i].player1 is not None:
                        for j in range(0, users.count()):
                            if users[j].id == games[i].player1.id:
                                player1 = users[j]
                    if games[i].player2 is not None:
                        for j in range(0, users.count()):
                            if users[j].id == games[i].player2.id:
                                player2 = users[j]
                    tab.append({
                        'game': games[i],
                        'player1': player1,
                        'player2': player2,
                    })
        return tab

    @database_sync_to_async
    def get_participants(self, tournament_id):
        tournament = Tournament.objects.get(pk=tournament_id)
        return tournament.participants.count()
