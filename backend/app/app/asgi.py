import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from decouple import config

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    config('DJANGO_SETTINGS_MODULE', default='app.settings_dev')
)

django_asgi_app = get_asgi_application()

from .middleware import JwtAuthMiddlewareStack
import game.routing

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': JwtAuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns
        )
    ),
})
