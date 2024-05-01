from django.urls import path

from .views import  GameListByTournamentAPIView, GameListCreateAPIView, ParticipationAPIView, ParticipationStatusUpdateView, TournamentAPIView, GameUpdateAPIView, TournamentDetailView

app_name = 'game_api'

urlpatterns = [
    path('',GameListCreateAPIView.as_view(), name='gameListCreate'),

	path('participant', ParticipationAPIView.as_view(), name='participant'),
	path('tournament', TournamentAPIView.as_view(), name='tournament'),
	path('tournament/<int:pk>/', TournamentDetailView.as_view(), name='tournament-detail'),
	path('<int:pk>/', GameUpdateAPIView.as_view(), name='update-game-score'),
	path('participation/<int:pk>/status/', ParticipationStatusUpdateView.as_view(), name='participation-status-update'),
	 path('games/tournament/<int:tournament_id>/', GameListByTournamentAPIView.as_view(), name='games-by-tournament'),
]
