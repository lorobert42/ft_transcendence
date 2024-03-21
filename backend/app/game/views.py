from django.shortcuts import render
import json

# Create your views here.

from django.http import JsonResponse
from .game import GameManager  # Import the game logic

# Temp test x and y axis
def game_state(request):
    # Mocked game state data
    data = {
        'player1': {'x': 40, 'y': 100},  # Test coordinates for player 1
        'player2': {'x': 980, 'y': 200},  # Test coordinates for player 2
        'ball': {'x': 500, 'y': 350},  # Test coordinates for the ball
    }
    print(json.dumps(data, indent=4))  # This will print the structured data to your Django console

    return JsonResponse(data)

'''
def game_state(request):
    # Assume GameManager can provide current state; you might need to adjust this
    game_manager = GameManager()
    data = {
        'player1': {'x': game_manager.paddle_left.x, 'y': game_manager.paddle_left.y},
        'player2': {'x': game_manager.right_paddle.x, 'y': game_manager.right_paddle.y},
        'ball': {'x': game_manager.ball.x, 'y': game_manager.ball.y},
    }
    return JsonResponse(data)
'''