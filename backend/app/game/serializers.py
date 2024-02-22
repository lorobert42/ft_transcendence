from rest_framework import serializers

from core.models import GameRoom


class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = [
            'id', 'name', 'user'
        ]
