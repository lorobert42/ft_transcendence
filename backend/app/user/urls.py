"""
URL mapping for user api
"""

from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from user import views

app_name = 'user'

urlpatterns = [
    path("create/", views.CreateUserView.as_view(), name="create"),
    path("login/", views.LoginUserView.as_view(), name="login"),
    path("otp/activation/", views.OTPEnableRequestView.as_view(), name="enable-otp"),
    path("otp/activation/confirm/", views.OTPEnableConfirmView.as_view(), name="enable-otp-confirm"),
    path("otp/verify/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("otp/disable/", views.OTPDisableView.as_view(), name="disable-otp"),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
	path('friend/', views.AddFriendView.as_view(), name='add-friend'),
    path('friend/<int:pk>/', views.DeleteFriendView.as_view(), name='delete-friend'),
    path("me/", views.ManageUserView.as_view(), name="me"),
    path('users/', views.ListUsersView.as_view(), name='user-list'),

    path('friend-invitations/', views.FriendInvitationListCreateView.as_view(), name='create-friend-invitation'),
    path('friend-invitations/<int:pk>/', views.FriendInvitationUpdateView.as_view(), name='update-friend-invitation'),

]
