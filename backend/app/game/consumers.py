
import json
import time
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .game import GameClass, Ball, Paddle

from icecream import ic

""" Define for move of the paddle. """
KEY_P1_UP, KEY_P1_DOWN, KEY_P2_UP, KEY_P2_DOWN = 1, 2, 3, 4
WIDTH, HEIGHT = 1000, 700  # Game size

class GameRoomConsumer(AsyncWebsocketConsumer):
    game_tab = dict()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    """ All the management of the websocket. """
    async def connect(self):
        """ Comportement of the websocket when created. """
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.game_room_group = 'game_%s' % self.room_id

        if GameRoomConsumer.game_tab.get(self.room_id) == None:
            GameRoomConsumer.game_tab[self.room_id] = GameClass(self.room_id)

        print("User connectiton")
        ic(self.scope['user'].email)
        """ Test to see if the game is created when is none existant. (can be deleted)"""
        try:
            print(GameRoomConsumer.game_tab[self.room_id].count)
        except:
            print("no value in dic")

        await self.channel_layer.group_add(
            self.game_room_group,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):
        """ Comportement of the websocket when disconnect. """
        ic (GameRoomConsumer.game_tab[self.room_id].p2['state'])
        if GameRoomConsumer.game_tab[self.room_id].p1['name'] == self.scope['user'].email:
            if GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'local' \
            or GameRoomConsumer.game_tab[self.room_id].p2['name'] == 'bot':
                GameRoomConsumer.game_tab.pop(self.room_id)
            elif GameRoomConsumer.game_tab[self.room_id].p2['state'] == False:
                print("game discard")
                GameRoomConsumer.game_tab.pop(self.room_id)
            else:
                print("user 1 disconnect")
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = False
        if GameRoomConsumer.game_tab[self.room_id].p2['name'] == self.scope['user'].email:
            if GameRoomConsumer.game_tab[self.room_id].p1['name'] == 'bot':
                GameRoomConsumer.game_tab.pop(self.room_id)
            elif GameRoomConsumer.game_tab[self.room_id].p1['state'] == False:
                print("game discard")
                GameRoomConsumer.game_tab.pop(self.room_id)
            else:
                print("user 2 disconnect")
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = False
                ic (GameRoomConsumer.game_tab[self.room_id].p2['state'])
        await self.channel_layer.group_discard(
            self.game_room_group,
            self.channel_name,
        )

    async def receive(self, text_data):
        """ Comportement of the class when a certain message is send from the frontend. """
        td_json = json.loads(text_data)
        if 'join' in td_json:
            await self.add_user(td_json['join'])
        if 'local' in td_json:
            await self.handle_move_local(td_json['local'])
        if 'move' in td_json:
            await self.handle_move_online(td_json['move'])
        if 'start' in td_json:
            await self.handle_start(td_json['start'])

    async def handle_move_online(self, move):
        print(self.scope['user'].email, "Direction", move)
        if self.scope['user'].email == GameRoomConsumer.game_tab[self.room_id].p1['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P1_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P1_DOWN)
        if self.scope['user'].email == GameRoomConsumer.game_tab[self.room_id].p2['name']:
            if move == 'UP':
                await self.handle_paddle_move(KEY_P2_UP)
            elif move == 'DOWN':
                await self.handle_paddle_move(KEY_P2_DOWN)

    async def add_user(self, mode):
        if mode == "online":
            print("adding user ", self.scope['user'].email)
            if GameRoomConsumer.game_tab[self.room_id].p1['name'] == None:
                GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.scope['user'].email
                GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
            else:
                GameRoomConsumer.game_tab[self.room_id].p2['name'] = self.scope['user'].email
                GameRoomConsumer.game_tab[self.room_id].p2['state'] = True
        else:
            GameRoomConsumer.game_tab[self.room_id].p1['name'] = self.scope['user'].email
            GameRoomConsumer.game_tab[self.room_id].p1['state'] = True
            GameRoomConsumer.game_tab[self.room_id].p2['name'] = "local"
            GameRoomConsumer.game_tab[self.room_id].p2['state'] = True

    async def handle_move_local(self, message):
        if message == "P1_UP":
            await self.handle_paddle_move(KEY_P1_UP)
            print("P1 UP")
        elif message == "P1_DOWN":
            await self.handle_paddle_move(KEY_P1_DOWN)
            print("P1 DOWN")
        elif message == "P2_UP":
            await self.handle_paddle_move(KEY_P2_UP)
            print("P2 UP")
        elif message == "P2_DOWN":
            await self.handle_paddle_move(KEY_P2_DOWN)
            print("P2 DOWN")

    async def handle_start(self, message):
        if message == "start":
            if GameRoomConsumer.game_tab[self.room_id].p1['state'] == True and GameRoomConsumer.game_tab[self.room_id].p2['state'] == True:
                print("game started")
                GameRoomConsumer.game_tab[self.room_id].active = True
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
        """ Main loop that will run the Game. """
        print("in loop")
        while GameRoomConsumer.game_tab[self.room_id].active is True:
            if GameRoomConsumer.game_tab[self.room_id].score_p1 < GameRoomConsumer.game_tab[self.room_id].max_score and \
            GameRoomConsumer.game_tab[self.room_id].score_p2 < GameRoomConsumer.game_tab[self.room_id].max_score:
                """ Game logic """
                GameRoomConsumer.game_tab[self.room_id].ball.move()
                ball = GameRoomConsumer.game_tab[self.room_id].ball
                left = GameRoomConsumer.game_tab[self.room_id].paddle_l
                right = GameRoomConsumer.game_tab[self.room_id].paddle_r
                if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad <= 0: # Ball hit the ceiling
                    GameRoomConsumer.game_tab[self.room_id].ball.y_vel *= -1
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
                if ball.x <= 0: # right have scored so P2 won a point
                    GameRoomConsumer.game_tab[self.room_id].score_p2 += 1
                    GameRoomConsumer.game_tab[self.room_id].ball.reset()
                elif ball.x >= WIDTH: # left have scored so P1 won a point
                    GameRoomConsumer.game_tab[self.room_id].score_p1 += 1
                    GameRoomConsumer.game_tab[self.room_id].ball.reset()

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
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_end",
                        "message": "Game Ended",
                    }
                )
                GameRoomConsumer.game_tab[self.room_id].active = False

    async def send_state(self, event):
        """ Function that send state of the curent game. """
        state = event['state']
        await self.send(text_data=json.dumps(state))

    async def send_end(self, event):
        """ Function that a message to the front when the game haas ended. """
        message = event['messgae']
        await self.send(text_data=json.dumps(message))

