from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

from django.contrib import admin
from django.urls import path, include

from game.views import game_state

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('api/docs', SpectacularSwaggerView.as_view(url_name='api-schema'),
         name='api-docs'),
    path('api/user/', include('user.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/game/state/', game_state, name='game_state'),
]