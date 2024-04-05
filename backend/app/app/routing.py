
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

import chat.routing
import game.routing

from app.middleware import TokenAuthMiddlewareStack

print("ASGI SETTINGS_GAME: ", game.routing.websocket_urlpatterns)
print("ASGI SETTINGS_CHAT: ", chat.routing.websocket_urlpatterns)

"""
application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': TokenAuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),

})
"""
application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
