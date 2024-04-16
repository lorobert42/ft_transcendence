
import json
import time
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .game import GameClass, Ball, Paddle

""" Define for move of the paddle. """
KEY_P1_UP, KEY_P1_DOWN, KEY_P2_UP, KEY_P2_DOWN = 1, 2, 3, 4
WIDTH, HEIGHT = 1000, 700  # Game size

class GameRoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.game_tab = dict()
        super().__init__(*args, **kwargs)

    """ All the management of the websocket. """
    async def connect(self):
        """ Comportement of the websocket when created. """
        self.game_room_id = self.scope['url_route']['kwargs']['game_room_name']
        self.game_room_group = 'game_%s' % self.game_room_id

        if self.game_tab.get(self.game_room_id) == None:
            self.game_tab['self.game_room_id'] = GameClass(self.game_room_id)

        """ Test to see if the game is created when is none existant. (can be deleted)"""
        try:
            print(self.game_tab['self.game_room_id'].count)
        except:
            print("no value in dic")

        await self.channel_layer.group_add(
            self.game_room_group,
            self.channel_name,
        )

        await self.accept()

        """ Send a message to the frontend to see if socket connected. (can be deleted)"""
        await self.channel_layer.group_send(
            self.game_room_group,
            {
                'type':'send_test',
                'tester':'Hello from Backend',
            }
        )

    async def disconnect(self, close_code):
        """ Comportement of the websocket when disconnect. """
        await self.channel_layer.group_discard(
            self.game_room_group,
            self.channel_name,
        )

    async def receive(self, text_data):
        """ Comportement of the class when a certain message is send from the frontend. """
        td_json =json.loads(text_data)
        message = td_json['message']
        if message == "P1_UP":
            self.handle_paddle_move(KEY_P1_UP)
            print("P1 UP")
        elif message == "P1_DOWN":
            self.handle_paddle_move(KEY_P1_DOWN)
            print("P1 DOWN")
        elif message == "P2_UP":
            self.handle_paddle_move(KEY_P2_UP)
            print("P2 UP")
        elif message == "P2_DOWN":
            self.handle_paddle_move(KEY_P2_DOWN)
            print("P2 DOWN")
        elif message == "P1":
            self.game_tab['self.game_room_id'].p1 = True
            print("P1 join")
        elif message == "P2":
            self.game_tab['self.game_room_id'].p2 = True
            print("P2 join")
        elif message == "start":
            if self.game_tab['self.game_room_id'].p1 == True and self.game_tab['self.game_room_id'].p2 == True:
                print("game started")
                self.game_tab['self.game_room_id'].count = 30
                print(self.game_tab['self.game_room_id'].count)
                self.game_tab['self.game_room_id'].active = True
                self.game_tab['self.game_room_id'].task = asyncio.create_task(self.loop(
                self.game_tab['self.game_room_id'].max_score
                ))

    def handle_paddle_move(self, key):
        """Function that will move the paddle in function of the key pressed"""
        left = self.game_tab['self.game_room_id'].paddle_l
        right = self.game_tab['self.game_room_id'].paddle_r
        if key is KEY_P1_UP and left.y - left.vel >= 0:
            self.game_tab['self.game_room_id'].paddle_l.move(up=True)
        elif key is KEY_P1_DOWN and left.y + left.vel + left.height <= HEIGHT:
            self.game_tab['self.game_room_id'].paddle_l.move(up=False)
        elif key is KEY_P2_UP and right.y - right.vel >= 0:
            self.game_tab['self.game_room_id'].paddle_r.move(up=True)
        elif key is KEY_P2_DOWN and right.y + right.vel + right.height <= HEIGHT:
            self.game_tab['self.game_room_id'].paddle_r.move(up=False)

    async def loop(self, max_score):
        """ Main loop that will run the Game. """
        print("in loop")
        while self.game_tab['self.game_room_id'].active is True:
            if self.game_tab['self.game_room_id'].count > 0 and \
            (self.game_tab['self.game_room_id'].score_p1 < max_score or \
            self.game_tab['self.game_room_id'].score_p2 < max_score):

                """ count variable that helped me to configure the socket. (have to be removed)"""
                print(self.game_tab['self.game_room_id'].count)
                self.game_tab['self.game_room_id'].count -= 1

                """ Game logic """
                self.game_tab['self.game_room_id'].ball.move()
                ball = self.game_tab['self.game_room_id'].ball
                print(ball)
                left = self.game_tab['self.game_room_id'].paddle_l
                print(left)
                right = self.game_tab['self.game_room_id'].paddle_r
                print(right)
                if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad <= 0: # Ball hit the ceiling
                    self.game_tab['self.game_room_id'].ball.y_vel *= -1
                # Cheking the direction of the ball
                elif ball.x_vel < 0:
                    # Ball goes right to left <-
                    if ball.y >= left.y and ball.y <= left.y + left.height and ball.x - ball.rad <= left.x + left.width:
                        # Ball is hitting the left_paddle
                        middle_y = left.y + left.height / 2
                        difference_in_y = middle_y - ball.y
                        reduction_factor = (left.heigth / 2) / ball.max_vel_y
                        y_vel = difference_in_y / reduction_factor
                        self.game_tab['self.game_room_id'].ball.y_vel = -1 * y_vel
                        # Will change the velocity of the ball depending of where the
                        # Ball is hitting the paddle
                else:
                    # Ball goes left to right ->
                    if ball.y >= right.y and ball.y <= right.y + right.height and ball.x + ball.rad >= right.x:
                        # Ball is hitting the rigth_paddle
                        middle_y = right.x + right.height / 2
                        difference_in_y = middle_y - ball.y
                        reduction_factor = (right.height / 2) / ball.max_vel_y
                        y_vel = difference_in_y / reduction_factor
                        self.game_tab['self.game_room_id'].ball.y_vel = -1 * y_vel
                        # Will change the velocity of the ball depending of where the
                        # Ball is hitting the paddle
                if ball.x < 0: # right have scored so P2 won a point
                    self.game_tab['game_room_id'].score_p2 += 1
                    self.game_tab['game_room_id'].ball.reset()
                elif ball.x > WIDTH: # left have scored so P1 won a point
                    self.game_tab['game_room_id'].score_p1 += 1
                    self.game_tab['game_room_id'].ball.reset()

                print("HERE")
                """ Getting data to send to the front """
                data = {
                    "P1": self.game_tab['self.game_room_id'].paddle_l.pos(),
                    "P2": self.game_tab['self.game_room_id'].paddle_r.pos(),
                    "Ball": self.game_tab['self.game_room_id'].ball.pos(),
                    "P1 Score": self.game_tab['self.game_room_id'].score_p1,
                    "P2 Score": self.game_tab['self.game_room_id'].score_p2,
                }
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_state",
                        "state": data,
                    }
                )
                await asyncio.sleep(1)
            else:
                print("Game ended, end of the main loop.")
                self.game_tab['self.game_room_id'].active = False

    async def send_test(self, event):
        """ Test function that send a message to the frontend. """
        tester = event['tester']

        await self.send(text_data=json.dumps({
            'tester': tester,
        }))

    async def send_state(self, event):
        """ Function that send state of the curent game. """
        state = event['state']
        await self.send(text_data=json.dumps(state))
