"""
Serializers for user api views
"""
from drf_spectacular.utils import extend_schema_field
from datetime import datetime, timedelta, timezone
from django.contrib.auth import authenticate

from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.state import token_backend

from core.models import User


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
            'avatar': {'read_only': True},
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


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'avatar', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 5},
        }

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
        try:
            payload = token_backend.decode(attrs.get('refresh'), verify=True)
        except Exception:
            raise exceptions.AuthenticationFailed("Invalid refresh token")
        user: User = User.objects.filter(id=payload['user_id']).first()
        attrs['user_object'] = user
        return attrs

    def create(self, validated_data):
        user: User = validated_data.get('user_object')
        tokens = getJWT(user)
        return tokens
