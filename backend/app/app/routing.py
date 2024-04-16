
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

import game.routing

print("ASGI SETTINGS_GAME: ", game.routing.websocket_urlpatterns)

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
	  'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
