from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from .middleware import JwtAuthMiddlewareStack
import game.routing

application = ProtocolTypeRouter({
	'http': get_asgi_application(),
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
