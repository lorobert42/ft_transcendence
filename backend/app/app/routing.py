
from channel.auth import AuthMiddlewareStack
from channel.routing import ProtocolTypeRouter, URLRouter

import game.routing

print("ASGI SETTINGS_GAME: ", game.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
