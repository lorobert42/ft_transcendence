from django.shortcuts import render
import json
from django.db.models import Q
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema,  extend_schema, OpenApiParameter, OpenApiExample

# Create your views here.

from django.http import Http404, JsonResponse
import random

from core.models import Game, Tournament, Participation
from .serializers import GameSerializer, ParticipationStatusUpdateSerializer, TournamentSerializer, ParticipationSerializer,  TournamentPatchSerializer, Participation


class GameListCreateAPIView(generics.ListCreateAPIView):
    queryset = Game.objects.all()
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
        Automatically set player1 as the authenticated user when creating a new game.
        """
        serializer.save(player1=self.request.user)




# ViewSet for Tournament
class TournamentAPIView(generics.ListCreateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


class GameListByTournamentAPIView(generics.ListAPIView):
    serializer_class = GameSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Returns a list of all the games for a specific tournament only if the authenticated
        user is a participant in the tournament with an accepted status.
        """
        tournament_id = self.kwargs['tournament_id']
        user = self.request.user
        # Check if the user is a participant in the given tournament
        if not Participation.objects.filter(user=user, tournament__id=tournament_id).exists():
            raise Http404("You are not a participant in this tournament.")

        # Return games only for the tournament the user is a participant in
        return Game.objects.filter(tournament__id=tournament_id)

    def list(self, request, *args, **kwargs):
        """
        Overriding the list method to handle situations where the user might not be an accepted participant,
        which is checked in get_queryset.
        """
        response = super().list(request, *args, **kwargs)
        return response

class ParticipationStatusUpdateView(generics.UpdateAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipationStatusUpdateSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated
    http_method_names = ['patch']  # Restrict this view to only handle PATCH requests

    def get_queryset(self):
        # Filter queryset to only include the authenticated user's participation
        user = self.request.user
        return self.queryset.filter(user=user)

    # Optional: If you want to ensure even more security, override get_object too
    def get_object(self):
        # Attempt to retrieve the participation instance for the logged-in user
        try:
            # Ensure the participation belongs to the logged-in user and is for the specific tournament
            participation = Participation.objects.get(
                pk=self.kwargs.get('pk'),
                user=self.request.user
            )
            return participation
        except Participation.DoesNotExist:
            raise Http404("You do not have permission to modify this participation.")


class TournamentDetailView(generics.UpdateAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    http_method_names = ['patch']  # Only allow PATCH requests

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return TournamentPatchSerializer
        return TournamentSerializer  # Default to the main serializer for other methods if needed

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
