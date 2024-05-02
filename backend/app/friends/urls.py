from django.urls import path
from friends import views

app_name = 'friends'

urlpatterns = [
    path('', views.FriendsView.as_view(), name='all-friends'),
    path('<int:pk>/', views.FriendDetailView.as_view(), name='friend-detail'),
    path('invitations/', views.InvitationsView.as_view(), name='friend-invitations'),
    path('invitations/<int:pk>/', views.InvitationDetailView.as_view(), name='friend-invitation-details'),
]
