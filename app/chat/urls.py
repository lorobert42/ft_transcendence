# from django.urls import path

# from . import views

# urlpatterns = [
#     path('', views.index_view, name='chat-index'),
#     path('<str:room_name>/', views.room_view, name='chat-room'),
# ]

"""
URL mapping for chat api
"""

from django.urls import (
    path,
    include,
)
from rest_framework.routers import DefaultRouter
from chat import views

router = DefaultRouter()
router.register('room', views.RoomViewSet)
router.register('message', views.MessageViewSet)
app_name = 'chat'


urlpatterns = [
    path('', include(router.urls)),
]
