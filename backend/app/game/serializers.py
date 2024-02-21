from rest_framework import serializers


from core.models import GameRoom, Game, GameInfo
from django.contrib.auth import get_user_model

class GameRoomSerializer(serializer.ModelSerializer):
    class Meta:
        model = GameRoom
        field = ['name', 'user']

        #add a read only for field that need to net be modified

