"""
Serializers for chat app
"""

from rest_framework import serializers
from core.models import Room


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for recipe object"""

    class Meta:
        model = Room
        fields = [
            'name', 'online', 'id',
        ]
        read_only_fields = ('id',)
