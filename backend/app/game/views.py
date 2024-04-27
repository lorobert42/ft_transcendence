from django.shortcuts import render
import json
from django.db.models import Q
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework import generics, viewsets
from drf_spectacular.utils import extend_schema,  extend_schema, OpenApiParameter, OpenApiExample

# Create your views here.

from django.http import JsonResponse
import random

from core.models import Game, Tournament, Participation, GameInvitation, TournamentInvitation
from .serializers import GameSerializer, TournamentSerializer, ParticipationSerializer, GameScoreUpdateSerializer, GameInvitationSerializer, TournamentInvitationSerializer

class GameListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all the games
        where the currently authenticated user is either player1 or player2.
        """
        user = self.request.user
        return Game.objects.filter(Q(player1=user) | Q(player2=user))

    def perform_create(self, serializer):
        """
        Override this method if you need to perform custom actions
        before saving the new object.
        """
        serializer.save()


class GameUpdateAPIView(generics.GenericAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    http_method_names = ['patch']  # Allow only PATCH method


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
class GameInvitationListCreateView(generics.ListCreateAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer

class GameInvitationUpdateView(generics.UpdateAPIView):
    queryset = GameInvitation.objects.all()
    serializer_class = GameInvitationSerializer
    http_method_names = ['patch']  # Allow only PATCH method

# TournamentInvitation Views
class TournamentInvitationListCreateView(generics.ListCreateAPIView):
    queryset = TournamentInvitation.objects.all()
    serializer_class = TournamentInvitationSerializer

class TournamentInvitationUpdateView(generics.UpdateAPIView):
    queryset = TournamentInvitation.objects.all()
    serializer_class = TournamentInvitationSerializer
    http_method_names = ['patch']  # Allow only PATCH method