from django.urls import re_path

from game import consumers

websocket_urlpatterns = [
        re_path(r'ws/game/local/(?P<id>\w+)/$', consumers.GameRoomConsumer.as_asgi()),
        re_path(r'ws/game/online/(?P<id>\w+)/$', consumers.GameRoomConsumer.as_asgi()),
        re_path(r'ws/game/ai/(?P<id>\w+)/$', consumers.GameRoomConsumer.as_asgi()),
]
