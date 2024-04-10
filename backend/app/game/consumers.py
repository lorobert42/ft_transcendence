
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import time
from .thread_game import ThreadPool

class GameRoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.thread = None

        super().__init__(*args, **kwargs)

    """ All the management of the websocket. """
    async def connect(self):
        """ Comportement of the websocket when created. """
        self.game_room_name = self.scope['url_route']['kwargs']['game_room_name']
        self.game_room_group_name = 'game_%s' % self.game_room_name

        if self.game_room_name not in ThreadPool.threads:
            ThreadPool.add_game(self.game_room_name, self)

        self.thread = ThreadPool.threads[self.game_room_name]

        await self.channel_layer.group_add(
            self.game_room_group_name,
            self.channel_name,
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.game_room_group_name,
            {
                'type':'test_message',
                'tester':'Hello from Backend',
            }
        )

    async def disconnect(self, close_code):
        """ Comportement of the websocket when disconnect. """
        await self.channel_layer.group_discard(
            self.game_room_group_name,
            self.channel_name,
        )

    async def test_message(self, event):
        """ Test function that send a message to the frontend. """
        tester = event['tester']

        await self.send(text_data=json.dumps({
            'tester': tester,
        }))

    async def receive(self, text_data):
        """ Comportement of the class when a certain message is send from the frontend. """
        td_json =json.loads(text_data)
        message = td_json['message']
        if message == 'start':
            print("start receive")
            if not self.thread["count"]:
                self.count = 5
                self.thread['count'] = True
                print(self.count)
                print(self.thread['count'])

    """ Test of the multithreading to instance games"""
    def start_game(self):
        print("here")
        while True:
            if self.thread['count'] == True:
                self.count -= 1
                time.sleep(1)
                self.channel_layer.group_send(
                    self.game_room_group_name,
                    {
                        "type": "send_state",
                        "state": self.count,
                    }
                )

                print(self.count)
                if self.count == 0:
                    self.thread['count'] = False

    async def send_state(self, event):
        state = event['state']

        await self.send(text_data=json.dumps(state))
