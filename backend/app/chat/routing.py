# chat/routing.py

from django.urls import re_path

from chat import consumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_id>\w+)/$', consumer.ChatConsumer.as_asgi()),
]

# websocket_urlpatterns = [path("", consumers.ChatConsumer.as_asgi())]
