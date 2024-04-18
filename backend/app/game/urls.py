from django.urls import path

from .views import GameInvitationCreateView, GameInvitationListView, GameInvitationUpdateView, GameList, GameCreateAPIView, ParticipationAPIView, TournamentAPIView, GameUpdateAPIView

app_name = 'game_api'

urlpatterns = [
    path('list',GameList.as_view(), name='gameList'),
	path('create', GameCreateAPIView.as_view(), name='create-game'),

	path('participant', ParticipationAPIView.as_view(), name='participant'),
	path('tournament', TournamentAPIView.as_view(), name='tournament'),
	path('games/<int:pk>/', GameUpdateAPIView.as_view(), name='update-game-score'),
	path('game-invitations/create/', GameInvitationCreateView.as_view(), name='create-game-invitation'),
    path('game-invitations/update/<int:pk>/', GameInvitationUpdateView.as_view(), name='update-game-invitation'),
    path('game-invitations/', GameInvitationListView.as_view(), name='list-game-invitations'),

]
