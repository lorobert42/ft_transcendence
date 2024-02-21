
from channel.auth import AuthMiddlewareStack
from channel.routing import ProtocolTypeRouter, URLRouter

import game.routing


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
