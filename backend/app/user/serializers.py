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

from core.models import User, FriendInvitation


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'name']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 5},
        }

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        user = get_user_model().objects.create_user(**validated_data)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user objects, handling read and update operations."""

    class Meta:
        model = get_user_model()
        fields = ['email', 'name', 'id', 'avatar', 'friends', 'password', 'last_active']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 5},
            'friends': {'read_only': True}  # Assuming friends are handled separately
        }

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        avatar = validated_data.pop('avatar', None)

        # Update fields if they are included in the request
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        if avatar:
            # Assuming avatar is a file, handle file save

            instance.avatar = avatar

        instance.save()
        return instance


class OTPEnableRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
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
            "user_id": user.id,
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

class AddFriendSerializer(serializers.Serializer):
    friend_id = serializers.IntegerField()

    def validate_friend_id(self, value):
        # Check that the context has the request and then compare user IDs
        request = self.context.get('request')
        if request and value == request.user.id:
            raise serializers.ValidationError("You cannot add or delete yourself.")
        return value

class FriendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = '__all__'

    def validate(self, data):
        if data['user1'] == data['user2']:
            raise serializers.ValidationError("User1 and User2 cannot be the same person.")
        return data