from django.shortcuts import render

from core.models import Room
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication  # noqa: F401
from rest_framework.permissions import IsAuthenticated  # noqa: F401

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
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """
        Return objects for current authenticated user only
        """
        return self.queryset.all().order_by('-id')
