from django.urls import path

from .views import GameInvitationCreateView, GameInvitationListView, GameInvitationUpdateView, GameList, GameCreateAPIView, ParticipationAPIView, TournamentAPIView, GameUpdateAPIView

app_name = 'game_api'

urlpatterns = [
    path('',GameList.as_view(), name='gameList'),
	path('', GameCreateAPIView.as_view(), name='create-game'),

	path('participant', ParticipationAPIView.as_view(), name='participant'),
	path('tournament', TournamentAPIView.as_view(), name='tournament'),
	path('<int:pk>/', GameUpdateAPIView.as_view(), name='update-game-score'),
	path('game-invitations/', GameInvitationCreateView.as_view(), name='create-game-invitation'),
    path('game-invitations/<int:pk>/', GameInvitationUpdateView.as_view(), name='update-game-invitation'),
    path('game-invitations/', GameInvitationListView.as_view(), name='list-game-invitations'),

]
