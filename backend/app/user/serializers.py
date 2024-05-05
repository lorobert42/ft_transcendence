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
import re

from core.models import User


class UserListSerializer(serializers.ModelSerializer):
    is_connected = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['is_connected', 'id', 'email', 'name', 'is_playing']

    def get_is_connected(self, obj):
        return (datetime.now(timezone.utc) - obj.last_active) <= timedelta(minutes=5)


class UserSerializer(serializers.ModelSerializer):
    is_connected = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['email', 'name', 'id', 'avatar', 'friends', 'password', 'last_active', 'otp_enabled', 'is_connected', 'is_playing']
        extra_kwargs = {
            'id': {'read_only': True},
            'avatar': {'read_only': True},
            'friends': {'read_only': True},
            'password': {'write_only': True, 'min_length': 5},
            'last_active': {'read_only': True},
            'otp_enabled': {'read_only': True},
            'is_connected': {'read_only': True},
            'is_playing': {'read_only': True},
        }

    @extend_schema_field(serializers.BooleanField())
    def get_is_connected(self, obj):
        """Property method to return boolean based on last active time."""
        return (datetime.now(timezone.utc) - obj.last_active) <= timedelta(minutes=5)
    
    def validate_name(self, value):
        """Validates the name field to only contain uppercase and lowercase letters and hyphens."""
        if not re.match(r'^[\w\-\s]+$', value, re.UNICODE):
            raise serializers.ValidationError("Name can only contain uppercase and lowercase letters and hyphens.")
        return value

    def validate_password(self, value):
        """Validates that the password is at least 5 characters long, includes at least one number, one uppercase letter, and one lowercase letter."""
        if len(value) < 5:
            raise serializers.ValidationError("Password must be at least 5 characters long.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must include at least one number.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must include at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must include at least one lowercase letter.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if password:
            validated_data['password'] = self.validate_password(password)
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

    def validate_password(self, value):
        """Validates that the password is at least 5 characters long, includes at least one number, one uppercase letter, and one lowercase letter."""
        if len(value) < 5:
            raise serializers.ValidationError("Password must be at least 5 characters long.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must include at least one number.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must include at least one uppercase letter.")
        if not any(char.islower() for char in value):
            raise serializers.ValidationError("Password must include at least one lowercase letter.")
        return value

    def update(self, instance, validated_data):
        """Update a user, setting the password correctly and return it"""
        password = validated_data.pop('password', None)
        avatar = validated_data.pop('avatar', None)
        
        instance.email = validated_data.get('email', instance.email)
        instance.name = validated_data.get('name', instance.name)

        if password:
            # Validate the password before setting it
            password = self.validate_password(password)
            instance.set_password(password)
        if avatar:
            # Delete the existing avatar if it's not the default before setting a new one
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
        email = attrs.get("email")
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
