import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from core.models import Room
from channels.db import database_sync_to_async





class ChatConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None

    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_name

        print("room name connect", self.room_group_name)
        print("room name channel", self.channel_name)

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

        # # Check if user is part of the room
        # if self.user.is_authenticated:
        #     room = self.get_room()
        #     if room and self.user in room.participants.all():
        #         # Join room group
        #         async_to_sync(self.channel_layer.group_add)(
        #             self.room_group_name, self.channel_name
        #         )
        #         self.accept()
        #     else:
        #         self.close()  # Close the connection if the user is not a participant
        # else:
        #     self.close()


    def disconnect(self, close_code):
        print("room name disconnect", self.room_group_name)
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name,
        )

     # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print("message in receive:", message)

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    def chat_message(self, event):
        message = event["message"]
        print("message in chat_message:", message)

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))

     # Helper method to get the room
    @database_sync_to_async
    def get_room(self):
        try:
            return Room.objects.get(id=self.room_name)
        except Room.DoesNotExist:
            return None
