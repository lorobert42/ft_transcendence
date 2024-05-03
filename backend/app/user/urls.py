"""
URL mapping for user api
"""

from django.urls import path
from user import views

app_name = 'users'

urlpatterns = [
    path("", views.UserListCreateView.as_view(), name="create"),
    path("login/", views.LoginUserView.as_view(), name="login"),
    path("token/refresh/", views.RefreshTokenView.as_view(), name='token_refresh'),
    path("me/", views.ManageUserView.as_view(), name="me"),
]
