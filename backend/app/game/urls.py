from django.urls import path

from .views import GameRoomList, GameRoomDetail

app_name = 'game_api'

urlpatterns = [
    path('<int:pk>/', GameRoomDetail.as_view(), name='detailcreate'),
    path('',GameRoomList.as_view(), name='listcreate'),
]
