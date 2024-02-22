import json
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response

from core.models import Room, Message, User
from rest_framework import viewsets, status, generics
from rest_framework.authentication import TokenAuthentication  # noqa: F401
from rest_framework.permissions import IsAuthenticated  # noqa: F401
from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer


from chat import serializers

"""
def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
    })


def room_view(request, room_name):
    chat_room, created = Room.objects.get_or_create(name=room_name)
    return render(request, 'room.html', {
        'room': chat_room,
    })
"""

class RoomViewSet(viewsets.ModelViewSet):
    """
    View for manage chat APIs
    """
    serializer_class = serializers.RoomSerializer
    queryset = Room.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)


    def get_queryset(self):
        """
        Return objects for current authenticated user only
        """
        print("TEST 1")
        return self.queryset.all().order_by('-id')

    def create(self, request, *args, **kwargs):
        print("Request Data:", request.data)
        print("headder:", request.headers)
        print("current user:", request.user.id)
        request.data['user_id'] = request.data.get('user_id')
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MessageViewSet(viewsets.ModelViewSet):
    """
    View for manage chat APIs
    """
    serializer_class = serializers.MessageSerializer
    queryset = Message.objects.all()
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return objects for current authenticated user only
        """
        return self.queryset.all().order_by('-id')


    def perform_create(self, serializer):
        message = serializer.save(user=self.request.user)
        channel_layer = get_channel_layer()
        room_group_name = f'chat_{message.room.id}'
        print("room group name:", room_group_name)

        @async_to_sync
        async def send_message():
            print("message:", message.content)
            await channel_layer.group_send(
            "chat_3",
            {
                'type': 'chat_message',
                'message': message.content,
                'user': message.user.id,
                'timestamp': message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }
            )
            print("message sent :", message.content)
        send_message()




