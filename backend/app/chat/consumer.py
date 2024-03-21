import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from core.models import Room
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


from django.contrib.auth.models import User


@database_sync_to_async
def get_room(room_id):
    try:
        return Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return None

@database_sync_to_async
def is_user_in_room(user, room):
    return user in room.participants.all() if room else False


class ChatConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Corrected this line
        self.room_name = None
        self.room_group_name = None
        self.room = None

    async def connect(self):
        print("starting connect")
        user = self.scope["user"]
        print("user id within connect", user.id)

        room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = "chat_%s" % self.room_name

        print("room name connect", self.room_group_name)
        print("room name channel", self.channel_name)
        self.user = self.scope["user"]
        print("user", self.user)


        if not user.is_authenticated:
            await self.close()
            return

        room = await get_room(room_id)

        if room and await is_user_in_room(user, room):
            self.room_group_name = f'chat_{room_id}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()

        # # Join room group
        # async_to_sync(self.channel_layer.group_add)(
        #     self.room_group_name, self.channel_name
        # )

        # self.accept()


    async def disconnect(self, close_code):
        if self.room_group_name:
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
            )
        print("Disconnected from room", self.room_group_name)


    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print("message in receive:", message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message}
        )

    async def chat_message(self, event):
        message = event["message"]
        print("message in chat_message:", message)

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

     # Helper method to get the room
    @database_sync_to_async
    def get_room(self, room_id):  # Added room_id parameter
        try:
            return Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return None
