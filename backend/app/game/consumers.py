
import json
import time
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from .game import GameClass

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

        try:
            print(self.game_tab['self.game_room_id'].count)
        except:
            print("no value in dic")

        await self.channel_layer.group_add(
            self.game_room_group,
            self.channel_name,
        )

        await self.accept()

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
        if message == 'start':
            print("start receive")
            self.game_tab['self.game_room_id'].count = 10
            print(self.game_tab['self.game_room_id'].count)
            self.game_tab['self.game_room_id'].active = True
            self.game_tab['self.game_room_id'].task = asyncio.create_task(self.loop())
            print("after loop")


    async def loop(self):
        """ Main loop that will run the Game. """
        print("in loop")
        while self.game_tab['self.game_room_id'].active is True:
            if self.game_tab['self.game_room_id'].count > 0:
                print(self.game_tab['self.game_room_id'].count)
                self.game_tab['self.game_room_id'].count -= 1
                await self.channel_layer.group_send(
                    self.game_room_group,
                    {
                        "type": "send_state",
                        "state": self.game_tab['self.game_room_id'].count,
                    }
                )
                await asyncio.sleep(1)
            else:
                print("end of the main loop")
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
