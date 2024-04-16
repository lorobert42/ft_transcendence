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
    path("otp-activation/", views.OTPEnableRequestView.as_view(), name="enable-otp"),
    path("otp-activation/confirm/", views.OTPEnableConfirmView.as_view(), name="enable-otp-confirm"),
    path("verify-otp/", views.VerifyOTPView.as_view(), name="verify-otp"),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
	path('add-friend/', views.AddFriendView.as_view(), name='add-friend'),
    path("me/", views.ManageUserView.as_view(), name="me"),
    path('users/', views.ListUsersView.as_view(), name='user-list'),
]
