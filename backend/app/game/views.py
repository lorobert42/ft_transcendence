from django.shortcuts import render
import json

# Create your views here.

from django.http import JsonResponse
import random

from rest_framework import generics

from core.models import GameRoom
from .serializers import GameRoomSerializer

class GameRoomList(generics.ListCreateAPIView):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer

class GameRoomDetail(generics.RetrieveDestroyAPIView):
    queryset = GameRoom.objects.all()
    serializer_class = GameRoomSerializer

# Temp test x and y axis
def game_state(request):
    # Mocked game state data
    data = {
        'player1': {'x': 40, 'y': 100},  # Test coordinates for player 1
        'player2': {'x': 980, 'y': 200},  # Test coordinates for player 2
        'ball': {'x': 400, 'y': 350},  # Test coordinates for the ball
    }
    print(json.dumps(data, indent=4))  # This will print the structured data to your Django console

    return JsonResponse(data)
