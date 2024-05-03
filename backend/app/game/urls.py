from django.urls import path

from .views import  GameListByTournamentAPIView, GameListCreateAPIView, UserParticipationListAPIView, ParticipationStatusUpdateView, TournamentAPIView,  TournamentDetailView

app_name = 'game_api'

urlpatterns = [
    path('',GameListCreateAPIView.as_view(), name='gameList'),
	path('tournament/', TournamentAPIView.as_view(), name='tournament'),
	path('tournament/<int:pk>/', TournamentDetailView.as_view(), name='tournament-detail'),
	path('participation/<int:pk>/status/', ParticipationStatusUpdateView.as_view(), name='participation-status-update'),
	path('my-participations/', UserParticipationListAPIView.as_view(), name='my-participations'),
	path('games/tournament/<int:tournament_id>/', GameListByTournamentAPIView.as_view(), name='games-by-tournament'),
]
