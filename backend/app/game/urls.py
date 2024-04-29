from django.urls import path

from .views import GameInvitationListCreateView,  GameInvitationUpdateView,  GameListCreateAPIView, ParticipationAPIView, TournamentAPIView, GameUpdateAPIView, TournamentInvitationListCreateView, TournamentInvitationUpdateView

app_name = 'game_api'

urlpatterns = [
    path('',GameListCreateAPIView.as_view(), name='gameListCreate'),

	path('participant', ParticipationAPIView.as_view(), name='participant'),
	path('tournament', TournamentAPIView.as_view(), name='tournament'),
	path('<int:pk>/', GameUpdateAPIView.as_view(), name='update-game-score'),
	path('game-invitations/', GameInvitationListCreateView.as_view(), name='list-create-game-invitation'),
    path('game-invitations/<int:pk>/', GameInvitationUpdateView.as_view(), name='update-game-invitation'),
	path('tournament-invitations/', TournamentInvitationListCreateView.as_view(), name='list-create-tournament-invitation'),
    path('tournament-invitations/<int:pk>/', TournamentInvitationUpdateView.as_view(), name='update-tournament-invitation'),

]
