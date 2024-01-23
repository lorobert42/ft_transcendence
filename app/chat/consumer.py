import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from core.models import Room, Message


class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None

    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.room = Room.objects.get(id=self.room_id)
        print("room name connect", self.room_group_name)

        # connection has to be accepted
        self.accept()

        print("room name connect", self.room_group_name)
        print("room name channel", self.channel_name)
        # join the room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

    # def receive(self, text_data=None, bytes_data=None):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']

    #     print("room name ", self.room_group_name)
    #     async_to_sync(self.channel_layer.group_send)(
    #         self.room_group_name,
    #         {
    #             'type': 'chat_message',
    #             'message': message,

    #         }
    #     )

    async def chatmessage(self, event):
    # Send a message down to the client
        print("event:", event)
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user'],
            'timestamp': event['timestamp']
        }))
