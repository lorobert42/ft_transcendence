"""
Serializers for chat app
"""

from django.forms import ValidationError
from rest_framework import serializers,  authentication

from core.models import Room, Message
from django.contrib.auth import get_user_model


def get_or_create_chat_room(user1, user2):
        if user1 == user2:
            print("TEST")
            raise serializers.ValidationError("Cannot create a chat room with the same user")

    # Check for an existing chat room with these two users
        existing_room = Room.objects.filter(participants=user1).filter(participants=user2)
        if existing_room.exists():
            return existing_room.first()  # Return the existing room

        # Create a new chat room if it doesn't exist
        new_room = Room.objects.create()
        new_room.participants.add(user1, user2)
        new_room.save()
        return new_room


class RoomSerializer(serializers.ModelSerializer):
    """Serializer for recipe object"""
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Room
        fields = [
            'name', 'participants', 'id', 'user_id'
        ]
        read_only_fields = ('id', 'participants',)


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        print("instance:", instance)
        print("instance participants:", instance.participants.all())
        current_user = request.user
        print("user:", current_user.id)
        if current_user in instance.participants.all():
            print("user in participants")
        else:
            raise serializer.ValidationError({'room': 'User does not have permission to view this room'})

        serializer = self.get_serializer(instance)
        print("serializer:", serializer.data)


    def create(self, validated_data):

        user_id = validated_data.pop('user_id')
        print("User ID:", user_id)
        User = get_user_model()
        auth_header = self.context['request'].headers.get('Authorization')
        print("Authorization Header:", auth_header)
        user = self.context['request'].user
        print("User:", user)
    # Check if the user is authenticated
        if not user.is_authenticated:
          raise serializers.ValidationError('User must be authenticated to create a room.')
        try:
            other_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({'user_id': 'No user found with this ID'})

        chat_room = get_or_create_chat_room(self.context['request'].user, other_user)

        chat_room.name = validated_data.get('name', 'Default Room Name')
        chat_room.save()

        return chat_room


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for recipe object"""

    class Meta:
        model = Message
        fields = [
             'id', 'user', 'room', 'timestamp', 'content',
        ]
        read_only_fields = ('id',)
