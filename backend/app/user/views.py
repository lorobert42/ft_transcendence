"""
Views for user api
"""
from django.db.models import Q
from django.forms import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions
from rest_framework.response import Response
from core.models import FriendInvitation, User
from rest_framework import status
from drf_spectacular.utils import extend_schema

from user.serializers import (
    FriendInvitationSerializer,
    UserSerializer,
    OTPEnableRequestSerializer,
    OTPEnableConfirmSerializer,
    OTPDisableSerializer,
    LoginSerializer,
    CustomTokenRefreshSerializer,
    VerifyOTPSerializer,
    AddFriendSerializer,
    CreateUserSerializer,
)


class UserAvatarUploadView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser)


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the system"""
    serializer_class = CreateUserSerializer


class OTPEnableRequestView(generics.GenericAPIView):
    """Enable 2FA"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OTPEnableRequestSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "user": user.id,
                "qr_code": user.qr_code.url,
                "message": "Scan QR code and send OTP",
            },
            status=200
        )


class OTPEnableConfirmView(generics.GenericAPIView):
    """Confirm 2FA activation"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OTPEnableConfirmSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        user = data["user_object"]
        return Response(
            {
                "success": True,
                "user": user.id,
                "backup_codes": data["backup_codes"],
                "message": "2FA enabled",
            },
            status=200
        )


class OTPDisableView(generics.GenericAPIView):
    """
    Disable 2FA
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OTPDisableSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "user": user.id,
                "message": "2FA disabled",
            },
            status=200
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
            return Response(
                {
                    "success": True,
                    "user": user.id,
                    "message": "Login Successful. Proceed to 2FA",
                },
                status=200,
            )
        response["tokens"]["user_id"] = response["user_id"]
        return Response(response["tokens"], status=200)


class RefreshTokenView(generics.GenericAPIView):
    """Refresh JWT"""
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenRefreshSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tokens: dict = serializer.save()
        return Response(tokens, status=200)


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info: dict = serializer.save()
        return Response(login_info, status=200)


class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrieve and return authenticated user"""
        print("Authentified User:", self.request.user.id)
        return self.request.user

    def patch(self, request, *args, **kwargs):
        # 'partial' parameter is set to True to allow partial updates
        return self.partial_update(request, *args, **kwargs)


class ListUsersView(generics.ListAPIView):
    """List all users in the system"""
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # You can add authentication and permission classes as needed
    # For example, restrict this view to admin users only
    permission_classes = [permissions.IsAuthenticated]


class AddFriendView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer  # This is for responses, keep as is if you are returning user data.
    request_serializer = AddFriendSerializer  # Define request serializer explicitly

    @extend_schema(
        request=AddFriendSerializer,  # Use the dedicated request serializer
        responses={201: {"description": "Friend added successfully"}, 400: {"description": "Bad request"}},
        description="Allows authenticated users to add other users as friends by providing the friend's user ID."
    )
    def post(self, request, *args, **kwargs):
        user = request.user
        serializer = self.request_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        friend_id = serializer.validated_data['friend_id']

        if friend_id == user.id:
            return Response({"message": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(pk=friend_id)
            # if friend in user.friends.all():
            #     return Response({"message": "This user is already your friend"}, status=status.HTTP_400_BAD_REQUEST)
            user.friends.add(friend)
            user.save()
            response_serializer = UserSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({"message": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteFriendView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer  # Used for response formatting

    @extend_schema(
        responses={
            204: {"description": "Friend successfully deleted"},
            400: {"description": "Bad request"},
            404: {"description": "Friend not found"}
        },
        description="Allows authenticated users to delete a friend by providing the friend's user ID in the URL."
    )
    def delete(self, request, pk, *args, **kwargs):
        if int(pk) == request.user.id:
            return Response({"message": "You cannot delete yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(pk=pk)
            if friend not in request.user.friends.all():
                return Response({"message": "This user is not currently your friend"}, status=status.HTTP_400_BAD_REQUEST)
            request.user.friends.remove(friend)
            return Response({"message": "Friend successfully deleted"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"message": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)


class FriendInvitationListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FriendInvitationSerializer

    def get_queryset(self):
        """
        This view returns a list of all the invitations
        where the currently authenticated user is either user1 or user2.
        """
        user = self.request.user
        return FriendInvitation.objects.filter(Q(user1=user) | Q(user2=user))

    def perform_create(self, serializer):
        """
        Prevent creating an invitation if one already exists between the same two users,
        regardless of the order of user1 and user2.
        """
        user1 = serializer.validated_data['user1']
        user2 = serializer.validated_data['user2']

        # Check if there is already an invitation between these two users in any order
        if FriendInvitation.objects.filter(
            (Q(user1=user1) & Q(user2=user2)) | (Q(user1=user2) & Q(user2=user1))
        ).exists():
            raise ValidationError('An invitation between these users already exists.')

        serializer.save()


class FriendInvitationUpdateView(generics.UpdateAPIView):
    queryset = FriendInvitation.objects.all()
    serializer_class = FriendInvitationSerializer
    http_method_names = ['patch']  # Allow only PATCH method

    def perform_update(self, serializer):
        # Retrieve the existing status before updating
        invitation = self.get_object()
        old_status = invitation.status

        # Update the invitation with new data
        serializer.save()

        # If status updated to 'accepted', add both users as friends
        if old_status != 'accepted' and serializer.validated_data.get('status') == 'accepted':
            user1 = invitation.user1
            user2 = invitation.user2

            # Check if they are already friends to avoid duplication
            if user2 not in user1.friends.all():
                user1.friends.add(user2)
                user1.save()

            if user1 not in user2.friends.all():
                user2.friends.add(user1)
                user2.save()

            # Optional: return a custom response or modify the instance
            # serializer.instance.additional_field = value
            # serializer.save()
