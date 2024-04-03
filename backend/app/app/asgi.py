"""
ASGI config for app project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/

"""
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
import game.routing
from app.middleware import TokenAuthMiddlewareStack

#print("ASGI SETTINGS_CHAT: ", chat.routing.websocket_urlpatterns)

application = get_asgi_application()
"""
application = ProtocolTypeRouter({
  'http': get_asgi_application(),
  'websocket': AuthMiddlewareStack(
        URLRouter(
            game.routing.websocket_urlpatterns,
        )
    ),
})
"""
