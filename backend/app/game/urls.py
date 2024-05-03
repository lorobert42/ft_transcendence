from django.urls import path

from game import views

app_name = 'games'

urlpatterns = [
    path('', views.GameListCreateAPIView.as_view(), name='gameList'),
    path('tournaments/', views.TournamentAPIView.as_view(), name='tournaments'),
    path('tournaments/<int:pk>/', views.TournamentDetailView.as_view(), name='tournament-detail'),
    path('participation/<int:pk>/status/', views.ParticipationStatusUpdateView.as_view(), name='participation-status-update'),
    path('my-participations/', views.UserParticipationListAPIView.as_view(), name='my-participations'),
    path('games/tournaments/<int:tournament_id>/', views.GameListByTournamentAPIView.as_view(), name='games-by-tournament'),
]
