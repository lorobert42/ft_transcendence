
import json
import time
import asyncio
from asyncio import CancelledError
from core.models import Game
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from .game import GameClass, Ball, Paddle
from .tournament import TournamentClass
import random

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
        self.current_user = self.scope['user'].email
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
        if self.room_id in GameRoomConsumer.game_tab:
            """ Stop the task if still running"""
            if not GameRoomConsumer.game_tab[self.room_id].task.done() \
            and self.game_type == "local":
                GameRoomConsumer.game_tab[self.room_id].task.cancel()
            try:
                await GameRoomConsumer.game_tab[self.room_id].task
            except CancelledError:
                print("Game have been cancelled")

            """ discard the game in dict if exist"""
            if GameRoomConsumer.game_tab[self.room_id].p1['name'] == self.current_user:
                if GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'local' \
                or GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'bot':
                    GameRoomConsumer.game_tab.pop(self.room_id)
                elif GameRoomConsumer.game_tab[self.room_id].p2['state'] == False:
                    GameRoomConsumer.game_tab.pop(self.room_id)
                else:
                    GameRoomConsumer.game_tab[self.room_id].p1['state'] = False
            elif GameRoomConsumer.game_tab[self.room_id].p2['name'] == self.current_user:
                if GameRoomConsumer.game_tab[self.room_id].p1['name'] == 'bot':
                    GameRoomConsumer.game_tab.pop(self.room_id)
                elif GameRoomConsumer.game_tab[self.room_id].p1['state'] == False:
                    GameRoomConsumer.game_tab.pop(self.room_id)
                else:
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
                GameRoomConsumer.game_tab[self.room_id] = GameClass(self.room_id, player_1_type, player_2_type)

            game_instance = GameRoomConsumer.game_tab[self.room_id]
            if game_instance.p1_type == 'bot':
                GameRoomConsumer.game_tab[self.room_id].p1['name'] = "bot"
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
            if game_instance.p2_type == 'bot':
                GameRoomConsumer.game_tab[self.room_id].p2['name'] = "bot"
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = True

            await self.add_user(td_json['join'])

        if 'local' in td_json:
            game_instance = GameRoomConsumer.game_tab[self.room_id]
            player_1_type = td_json.get('player_1_type', 'human')
            player_2_type = td_json.get('player_2_type', 'human')

            if ((td_json['local'] == 'P1_UP' or td_json['local'] == 'P1_DOWN') and game_instance.p1_type != 'bot'):
                await self.handle_move_local(td_json['local'])
            elif ((td_json['local'] == 'P2_UP' or td_json['local'] == 'P2_DOWN') and game_instance.p2_type != 'bot'):
                await self.handle_move_local(td_json['local'])
        if 'move' in td_json:
            await self.handle_move_online(td_json['move'])
        if 'start' in td_json and not GameRoomConsumer.game_tab[self.room_id].active:
            await self.handle_start(td_json['start'])
        # If player is a bot initialize and mark as ready


    async def handle_move_online(self, move):
        print(self.current_user, "Direction", move)
        if self.current_user == GameRoomConsumer.game_tab[self.room_id].p1['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P1_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P1_DOWN)
        if self.current_user == GameRoomConsumer.game_tab[self.room_id].p2['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P2_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P2_DOWN)

    async def add_user(self, mode):
        if mode == "online":
            print("adding user ", self.current_user)
            if self.get_current_player_pos(self.room_id, self.current_user) == 1:
                GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.current_user
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
                self.game.player1_status = "playing"
                await database_sync_to_async(self.game.save)()
            else:
                GameRoomConsumer.game_tab[self.room_id].p2['name'] = self.current_user
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = True
                self.game.player2_status = "playing"
                await database_sync_to_async(self.game.save)()
        else:
            GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.current_user
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
                    self.game.game_status = "running"
                    await database_sync_to_async(self.game.save)()
                GameRoomConsumer.game_tab[self.room_id].task = asyncio.create_task(self.loop(
                GameRoomConsumer.game_tab[self.room_id].max_score
                ))
        elif message == "restart":
            if GameRoomConsumer.game_tab[self.room_id].p1['state'] == True and GameRoomConsumer.game_tab[self.room_id].p2['state'] == True:
                GameRoomConsumer.game_tab[self.room_id].active = True
                GameRoomConsumer.game_tab[self.room_id].score_p1 = 0
                GameRoomConsumer.game_tab[self.room_id].score_p2 = 0
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
        print("p1 type: ", GameRoomConsumer.game_tab[self.room_id].p1_type)
        print("p2 type: ", GameRoomConsumer.game_tab[self.room_id].p2_type)
        if self.game_type == "online":
            self.game.game_status = "running"
            await database_sync_to_async(self.game.save)()
        self.hit_paddle = False
        self.reset_game = True
        self.hit_ceiling = False
        """ Main loop that will run the Game. """
        print("in loop")
        start_time = time.time()
        while GameRoomConsumer.game_tab[self.room_id].active:
            if self.reset_game == True or self.hit_paddle == True:
                end_time = time.time()
                elapsed_time = end_time - start_time
                start_time = time.time()
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
                elif ball.x >= WIDTH: # left have scored so P1 won a point
                    GameRoomConsumer.game_tab[self.room_id].score_p1 += 1
                    GameRoomConsumer.game_tab[self.room_id].ball.reset()
                    self.reset_game = True
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
                print("Game ended, end of the main loop.")
                if self.game_type == "online":
                    self.game.score1 = GameRoomConsumer.game_tab[self.room_id].score_p1
                    self.game.score2 = GameRoomConsumer.game_tab[self.room_id].score_p2
                    self.game.game_status = "finished"
                    await database_sync_to_async(self.game.save)()
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_end",
                        "message": "Game Ended",
                    }
                )
                GameRoomConsumer.game_tab[self.room_id].active = False

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

    async def send_state(self, event):
        """ Function that send state of the curent game. """
        state = event['state']
        await self.send(text_data=json.dumps(state))

    async def send_end(self, event):
        """ Function that a message to the front when the game haas ended. """
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def get_game(self, id):
        games = Game.objects.all()
        for i in range(0, games.count()):
            if games[i].id == id:
                return games[i]

    @database_sync_to_async
    def get_current_player_pos(self, id, user_name):
        games = Game.objects.all()
        for i in range(0, games.count()):
            if games[i].id == id:
                if games[i].player1.name == user_name:
                    return 1
                if games[i].player2.name == user_name:
                    return 2

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
            await self.get_games(int(self.room_id))
            TournamentConsumer.tournament_tab[self.room_id].task = asyncio.create_task(self.loop())


        await self.channel_layer.group_add(
            self.tournament_group,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, message):
        if TournamentConsumer.tournament_tab[self.room_id].task.done():
            TournamentConsumer.tournament_tab.pop(self.room_id)
        await self.channel_layer.group_discard(
            self.game_room_group,
            self.channel_name,
        )

    async def loop(self):
        while True:
            pass

    @database_sync_to_async
    def get_games(self, tournament_id):
        games = Game.objects.all()
        for i in range(0, games.count()):
            if games[i].tournament.id == tournament_id:
                self.max_game += 1
                game = {
                    'round': games[i].tournamentRound,
                    'pos': games[i].roundGame,
                    'game': games[i]
                }
                self.tournament.games[self.max_game] = game

