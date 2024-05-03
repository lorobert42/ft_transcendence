from rest_framework import generics, permissions, status
from rest_framework.response import Response

from mfa.serializers import (
    MfaDisableSerializer,
    MfaEnableConfirmSerializer,
    MfaEnableRequestSerializer,
    CheckOTPSerializer
)


class MfaEnableRequestView(generics.GenericAPIView):
    """Enable 2FA"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MfaEnableRequestSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "qr_code": user.qr_code.url,
                "message": "Scan QR code and send OTP",
            },
            status=status.HTTP_200_OK
        )


class MfaEnableConfirmView(generics.GenericAPIView):
    """Confirm 2FA activation"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MfaEnableConfirmSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(
            {
                "success": True,
                "backup_codes": data["backup_codes"],
                "message": "2FA enabled",
            },
            status=status.HTTP_200_OK
        )


class MfaDisableView(generics.GenericAPIView):
    """
    Disable 2FA
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MfaDisableSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "success": True,
                "message": "2FA disabled",
            },
            status=status.HTTP_200_OK
        )


class CheckOTPView(generics.GenericAPIView):
    serializer_class = CheckOTPSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info: dict = serializer.save()
        return Response(login_info, status=status.HTTP_200_OK)
