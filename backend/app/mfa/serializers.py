from django.contrib.auth import authenticate
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework import serializers, exceptions
from datetime import datetime, timezone
from io import BytesIO
import pyotp
import qrcode

from user.serializers import getJWT
from core.models import User


class MfaEnableRequestSerializer(serializers.Serializer):
    password = serializers.CharField()

    def validate(self, attrs: dict):
        user: User = self.context.get("request").user
        email = user.email
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=attrs.get("password"),
        )
        if not user or user.otp_enabled:
            raise exceptions.AuthenticationFailed("Error.")
        attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        user.otp_created_at = datetime.now(timezone.utc)
        user.login_otp_used = False
        user.otp_base32 = pyotp.random_base32()
        user.otp_auth_url = pyotp.totp.TOTP(user.otp_base32).provisioning_uri(
            name=user.email.lower(), issuer_name="ft_transcendence"
        )
        stream = BytesIO()
        image = qrcode.make(f"{user.otp_auth_url}")
        image.save(stream)
        if user.qr_code is not None:
            user.qr_code.delete()
        user.qr_code = ContentFile(
            stream.getvalue(), name=f"qr-{user.id}-{get_random_string(10)}.png"
        )
        user.save()
        return user


class MfaEnableConfirmSerializer(serializers.Serializer):
    otp = serializers.CharField()

    def validate(self, attrs: dict):
        user: User = self.context.get("request").user
        if user.qr_code is None or user.otp_enabled is True:
            if user.qr_code is not None:
                user.qr_code.delete()
                user.qr_code = None
            raise exceptions.ValidationError("MFA already enabled or no enable request found.")
        totp = pyotp.TOTP(user.otp_base32)
        if (
            not totp.verify(attrs.get("otp"), valid_window=1)
            or not user.is_valid_otp()
        ):
            user.qr_code.delete()
            user.qr_code = None
            raise exceptions.AuthenticationFailed("Invalid OTP.")
        attrs["user_object"] = user
        hotp = pyotp.HOTP(user.otp_base32)
        attrs["backup_codes"] = [hotp.at(i) for i in range(10)]
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        user.qr_code.delete()
        user.qr_code = None
        user.otp_enabled = True
        user.save()
        validated_data["user_object"] = user
        return validated_data


class MfaDisableSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, attrs: dict):
        user: User = self.context.get("request").user
        user = authenticate(
            request=self.context.get("request"),
            email=attrs.get("email"),
            password=attrs.get("password"),
        )
        if not user:
            raise exceptions.AuthenticationFailed("Unable to authenticate you.")
        if not user.otp_enabled:
            raise exceptions.ValidationError("MFA not enabled.")
        totp = pyotp.TOTP(user.otp_base32)
        user.otp_created_at = datetime.now(timezone.utc)
        user.login_otp_used = False
        user.save()
        if (
            totp.verify(attrs.get("otp"), valid_window=1)
            and user.is_valid_otp()
        ):
            attrs["user_object"] = user
            return super().validate(attrs)
        else:
            hotp = pyotp.HOTP(user.otp_base32)
            for i in range(10):
                if hotp.verify(attrs.get("otp"), i):
                    attrs["user_object"] = user
                    return super().validate(attrs)
        raise exceptions.AuthenticationFailed("Invalid OTP.")

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        user.otp_enabled = False
        user.otp_auth_url = None
        user.otp_base32 = None
        user.login_otp_used = True
        user.save()
        return user


class CheckOTPSerializer(serializers.Serializer):
    otp = serializers.CharField()
    user_id = serializers.IntegerField()

    def validate(self, attrs: dict):
        user: User = User.objects.filter(id=attrs.get("user_id")).first()
        if not user:
            raise exceptions.AuthenticationFailed("Authentication Failed.")
        totp = pyotp.TOTP(user.otp_base32)
        if (
            not totp.verify(attrs.get("otp"), valid_window=1)
            or not user.is_valid_otp()
        ):
            raise exceptions.AuthenticationFailed("Authentication Failed.")
        attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        tokens = getJWT(user)
        user.login_otp_used = True
        user.save(update_fields=["login_otp_used"])
        return tokens
