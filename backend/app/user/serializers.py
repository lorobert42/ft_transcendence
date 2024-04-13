"""
Serializers for user api views
"""

from datetime import datetime, timezone
from io import BytesIO
from django.contrib.auth import (
    get_user_model,
    authenticate,
)
from django.contrib.auth.hashers import make_password, check_password
from django.utils.translation import gettext as _
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string

from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
import qrcode

from core.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the users object"""

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'name', 'id', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 5},
        }

    def create(self, validated_data: dict):
        """Create a new user with encrypted password and return it"""
        avatar = validated_data.pop('avatar', None)
        user = get_user_model().objects.create_user(**validated_data)
        if avatar is not None:
            user.avatar = avatar
            user.save()
        user.save()
        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user


class OTPEnableRequestSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

    def validate(self, attrs: dict):
        user: User = User.objects.filter(id=attrs.get("user_id")).first()
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
        user.qr_code = ContentFile(
            stream.getvalue(), name=f"qr-{user.id}-{get_random_string(10)}.png"
        )
        user.save()
        return user


class OTPEnableConfirmSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    otp = serializers.CharField()

    def validate(self, attrs: dict):
        user: User = User.objects.filter(id=attrs.get("user_id")).first()
        if not user or user.qr_code is None or user.otp_enabled is True:
            if user.qr_code is not None:
                user.qr_code.delete()
                user.qr_code = None
            raise exceptions.AuthenticationFailed("Error.")
        totp = pyotp.TOTP(user.otp_base32)
        if (
            not totp.verify(attrs.get("otp"), valid_window=1)
            or not user.is_valid_otp()
        ):
            user.qr_code.delete()
            user.qr_code = None
            raise exceptions.AuthenticationFailed("Error.")
        attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        user.qr_code.delete()
        user.qr_code = None
        user.otp_enabled = True
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=attrs.get("password"),
        )
        if user is None:
            raise exceptions.AuthenticationFailed("Invalid login details.")
        else:
            attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        if user.otp_enabled:
            user.otp_created_at = datetime.now(timezone.utc)
            user.login_otp_used = False
            user.save(update_fields=["otp_created_at", "login_otp_used"])
            return {
                "otp": True,
                "user": user,
            }
        refresh = RefreshToken.for_user(user)
        return {
            "otp": False,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }


class VerifyOTPSerializer(serializers.Serializer):
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
        refresh = RefreshToken.for_user(user)
        user.login_otp_used = True
        user.save(update_fields=["login_otp_used"])
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user authentication object"""
    email = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=email,
            password=password,
        )
        if not user:
            msg = _('Unable to authenticate with provided credentials')
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return attrs
