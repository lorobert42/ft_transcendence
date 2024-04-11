"""
Views for user api
"""

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from core.models import Room, Message, User


from user.serializers import (
    UserSerializer,
)

class UserAvatarUploadView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)

class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = UserSerializer

class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authenticated user"""
        print("Authentified User:", self.request.user.id)
        return self.request.user

class ListUsersView(generics.ListAPIView):
    """List all users in the system"""
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # You can add authentication and permission classes as needed
    # For example, restrict this view to admin users only
    permission_classes = [permissions.IsAuthenticated]