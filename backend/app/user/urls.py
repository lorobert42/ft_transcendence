"""
URL mapping for user api
"""

from django.urls import path
from user import views

app_name = 'user'

urlpatterns = [
    path("", views.UserListCreateView.as_view(), name="create"),
	# path("list", views.ListUsersView.as_view(), name='user-list'),

    path("login/", views.LoginUserView.as_view(), name="login"),
    path("otp/activation/", views.OTPEnableRequestView.as_view(), name="enable-otp"),
    path("otp/activation/confirm/", views.OTPEnableConfirmView.as_view(), name="enable-otp-confirm"),
    path("otp/verify/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("otp/disable/", views.OTPDisableView.as_view(), name="disable-otp"),
    path("token/refresh/", views.RefreshTokenView.as_view(), name='token_refresh'),
    path("me/", views.ManageUserView.as_view(), name="me"),

    path('friend-invitations/', views.FriendInvitationListCreateView.as_view(), name='create-friend-invitation'),
    path('friend-invitations/<int:pk>/', views.FriendInvitationUpdateView.as_view(), name='update-friend-invitation'),
]
