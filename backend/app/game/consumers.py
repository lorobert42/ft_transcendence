from channels.generic.websocket import AsyncWebsocketConsumer


class GameRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_room_name = self.scope['url_route']['kwarg']['game_room_id']
        self.game_room_group_name = 'game_%s' % self.game_room_name
        await self.channel_layer.group_add(
            self.game_room_group_name,
            self.channel.name,
        )
        await self.channel_layer.group_send(
            self.game_room_group_name,
            {
                'type':'test_message',
                'tester':'test message',
            }
        )


    async def test_message(self, event):
        tester = event['tester']

        await self.send(text_data=json.dumps({
            'tester': tester,
        }))


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_room_group_name,
            self.channel.name,
        )
