"""
Views for user api
"""
from datetime import datetime, timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from core.models import User
from drf_spectacular.utils import extend_schema, extend_schema_view

from user.serializers import (
    UserSerializer,
    UserListSerializer,
    LoginSerializer,
    CustomTokenRefreshSerializer,
)


class LoginUserView(generics.GenericAPIView):
    """Login with email and password"""
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response: dict = serializer.save()

        if response["otp"]:
            user = response["user"]
            if user:
                user.last_active = datetime.now(timezone.utc)
                user.save(update_fields=['last_active'])
            return Response(
                {
                    "success": True,
                    "user": user.id,
                    "message": "Login Successful. Proceed to 2FA",
                },
                status=status.HTTP_200_OK,
            )
        response["tokens"]["user_id"] = response["user_id"]
        return Response(response["tokens"], status=status.HTTP_200_OK)


class RefreshTokenView(generics.GenericAPIView):
    """Refresh JWT"""
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens: dict = serializer.save()
        return Response(tokens, status=status.HTTP_200_OK)


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_object(self):
        """Retrieve and return authenticated user"""
        print("Authentified User:", self.request.user.id)
        return self.request.user

    def patch(self, request, *args, **kwargs):
        # 'partial' parameter is set to True to allow partial updates
        return self.partial_update(request, *args, **kwargs)


@extend_schema_view(
    get=extend_schema(
        operation_id='List Users',
        tags=['user'],
        summary='List All Users',
        description='Returns a list of all users if authenticated.',
        responses={200: UserListSerializer(many=True)}
    ),
    post=extend_schema(
        operation_id='Create User',
        tags=['user'],
        summary='Create New User',
        description='Creates a new user. Open for unauthenticated users.',
        responses={201: UserSerializer}
    )
)
class UserListCreateView(generics.ListCreateAPIView):
    """
    Endpoint for listing all users and creating a new user.
    """
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return UserSerializer
        return UserListSerializer

    def get_permissions(self):
        # Dynamically assign permissions based on the request type
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        else:
            return [permissions.IsAuthenticated()]

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
