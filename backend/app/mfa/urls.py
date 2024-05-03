from django.urls import path
from mfa import views

app_name = 'mfa'

urlpatterns = [
    path("activation/", views.MfaEnableRequestView.as_view(), name="enable-mfa"),
    path("activation/confirm/", views.MfaEnableConfirmView.as_view(), name="enable-mfa-confirm"),
    path("check/", views.CheckOTPView.as_view(), name="check-otp"),
    path("disable/", views.MfaDisableView.as_view(), name="disable-mfa"),
]
