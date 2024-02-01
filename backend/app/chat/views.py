import json
from django.forms import ValidationError
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


def index_view(request):
    return render(request, 'index.html', {
        'rooms': Room.objects.all(),
    })


def room_view(request, room_name):
    chat_room, created = Room.objects.get_or_create(name=room_name)
    return render(request, 'room.html', {
        'room': chat_room,
    })





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
        return self.queryset.all().order_by('-id')

    def retrieve(self, request, *args, **kwargs):
        """
        Custom retrieve method to return a single model instance.
        """
        try:
            instance = self.get_object()  # Retrieve the Room instance based on the provided pk (id)

            # You can include your custom logic here. For example:
            current_user = request.user
            if current_user not in instance.participants.all():
                    # Returning a custom error message with a 403 Forbidden status code
                return Response({'detail': 'User does not have permission to view this room.'}, status=status.HTTP_403_FORBIDDEN)

            # Serialize the instance
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except ValidationError as e:
            # Handle other types of validation errors, if needed
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST) #

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

        @async_to_sync
        async def send_message():
            print("room group name:", room_group_name)
            print("message:", message.content)
            await channel_layer.group_send(
            room_group_name,
            {
                'type': 'chat_message',
                'message': message.content,
                'user': message.user.id,
                'timestamp': message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }
            )
            print("message sent :", message.content)
        send_message()




