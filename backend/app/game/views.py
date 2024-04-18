from django.shortcuts import render
import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics, viewsets
from drf_spectacular.utils import extend_schema,  extend_schema, OpenApiParameter, OpenApiExample

# Create your views here.

from django.http import JsonResponse
import random

from core.models import Game, Tournament, Participation, GameInvitation
from .serializers import GameSerializer, TournamentSerializer, ParticipationSerializer, GameScoreUpdateSerializer, GameInvitationSerializer

class GameList(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


class GameCreateAPIView(generics.GenericAPIView):
    serializer_class = GameSerializer  # Specify the serializer class here

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)  # Use get_serializer method
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GameUpdateAPIView(generics.GenericAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


    @extend_schema(
        request=GameScoreUpdateSerializer,  # Specify the request serializer for PATCH
        responses={200: GameSerializer},  # Response might still use the full game serializer
        methods=['PATCH'],
        description="Updates the scores of a game. Only 'score1' and 'score2' can be updated."
    )
    def patch(self, request, *args, **kwargs):
        game = self.get_object()
        serializer = GameScoreUpdateSerializer(game, data=request.data, partial=True)  # partial=True allows for partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_object(self):
        game_id = self.kwargs.get('pk')
        return generics.get_object_or_404(Game, pk=game_id)

# ViewSet for Tournament
class TournamentAPIView(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer

# ViewSet for Participation
class ParticipationAPIView(generics.ListCreateAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer

# GameInvitation Views
class GameInvitationCreateView(generics.CreateAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer

class GameInvitationUpdateView(generics.UpdateAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer

class GameInvitationListView(generics.ListAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer