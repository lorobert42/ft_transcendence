from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from core.models import FriendInvitation, User
from friends.serializers import (
    AddFriendSerializer,
    FriendSerializer,
    UserFriendSerializer,
    InvitationSerializer,
    AcceptInvitationSerializer,
)


class FriendsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AddFriendSerializer

    def get(self, request, format=None):
        user = User.objects.filter(id=request.user.id).first()
        serializer = FriendSerializer(user)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            context={"request": request},
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data, status=status.HTTP_201_CREATED)


class FriendDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserFriendSerializer

    def get(self, request, *args, **kwargs):
        user = User.objects.filter(id=request.user.id).first()
        try:
            friend = user.friends.get(id=self.kwargs['pk'])
        except User.DoesNotExist:
            return Response({'message': 'Friend not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(friend)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        user = User.objects.filter(id=request.user.id).first()
        try:
            friend = user.friends.get(id=self.kwargs['pk'])
        except User.DoesNotExist:
            return Response({'message': 'Friend not found.'}, status=status.HTTP_404_NOT_FOUND)
        user.friends.remove(friend)
        return Response({'message': 'Friend removed'})


class InvitationsView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InvitationSerializer

    def get_queryset(self):
        user = self.request.user
        return FriendInvitation.objects.filter(
            Q(user1=user) |
            Q(user2=user)
        )


class InvitationDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InvitationSerializer

    def get_queryset(self):
        user = self.request.user
        return FriendInvitation.objects.filter(
            Q(user1=user) |
            Q(user2=user)
        )

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AcceptInvitationSerializer(
            instance,
            context={'request': request},
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
