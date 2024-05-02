"""
Serializers for user api views
"""
from drf_spectacular.utils import extend_schema, extend_schema_field
from datetime import datetime, timedelta, timezone
from io import BytesIO
from django.contrib.auth import (
    authenticate,
)
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string

from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.state import token_backend
import pyotp
import qrcode

from core.models import User, FriendInvitation


class UserListSerializer(serializers.ModelSerializer):
    is_connected = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['is_connected', 'id', 'email', 'name', 'is_playing']

    def get_is_connected(self, obj):
        return (datetime.now(timezone.utc) - obj.last_active) <= timedelta(minutes=5)

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user objects, handling read and update operations."""
    is_connected = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['email', 'name', 'id', 'avatar', 'friends', 'password', 'last_active', 'otp_enabled', 'is_connected', 'is_playing']
        extra_kwargs = {
            'id': {'read_only': True},
            'avatar': {'allow_null': True},
            'friends': {'read_only': True},  # Assuming friends are handled separately
            'password': {'write_only': True, 'min_length': 5},
            'last_active': {'read_only': True},
            'otp_enabled': {'read_only': True},
            'is_connected': {'read_only': True},
            'is_playing': {'read_only': True},
        }

    @extend_schema_field(serializers.BooleanField())
    def get_is_connected(self, obj):
        """Property method to return boolean based on last active time."""
        return obj.is_connected

    def create(self, validated_data):
        """Create a new user with encrypted password and return it"""
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        avatar = validated_data.pop('avatar', None)
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)

        if password:
            instance.set_password(password)

        if avatar:
            if instance.avatar.name != 'user_avatars/default-avatar.png':
                instance.avatar.delete()
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
        if user.qr_code is not None:
            user.qr_code.delete()
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


class OTPDisableSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    otp = serializers.CharField()

    def validate(self, attrs: dict):
        email = attrs.get("email").lower().strip()
        user = authenticate(
            request=self.context.get("request"),
            email=email,
            password=attrs.get("password"),
        )
        if not user or not user.otp_enabled:
            raise exceptions.AuthenticationFailed("Error.")
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
        raise exceptions.AuthenticationFailed("Error.")

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        user.otp_enabled = False
        user.otp_auth_url = None
        user.otp_base32 = None
        user.login_otp_used = True
        user.save()
        return user


def getJWT(user):
    refresh = RefreshToken.for_user(user)

    refresh['email'] = user.email
    refresh['name'] = user.name
    refresh['avatar'] = str(user.avatar)
    refresh['otp_enabled'] = user.otp_enabled
    refresh['last_active'] = str(user.last_active)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


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
        tokens = getJWT(user)
        return {
            "otp": False,
            "user_id": user.id,
            "tokens": tokens
        }


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        payload = token_backend.decode(attrs.get('refresh'), verify=True)
        user: User = User.objects.filter(id=payload['user_id']).first()
        attrs['user_object'] = user
        return attrs

    def create(self, validated_data):
        user: User = validated_data.get('user_object')
        tokens = getJWT(user)
        return tokens


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
        tokens = getJWT(user)
        user.login_otp_used = True
        user.save(update_fields=["login_otp_used"])
        return tokens


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
