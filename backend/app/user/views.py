"""
Views for user api
"""

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions
from rest_framework.response import Response
from core.models import Room, Message, User
from rest_framework import status
from drf_spectacular.utils import extend_schema,  extend_schema, OpenApiParameter, OpenApiExample

from user.serializers import (
    UserSerializer,
    OTPEnableRequestSerializer,
    OTPEnableConfirmSerializer,
    LoginSerializer,
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
        user = serializer.save()
        return Response(
            {
                "success": True,
                "user": user.id,
                "message": "2FA enabled",
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
        return Response(response["tokens"], status=200)


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
    serializer_class = UserSerializer

    @extend_schema(
        request=AddFriendSerializer,  # Use the dedicated request serializer
        responses={201: {"description": "Friend added successfully"}, 400: {"description": "Bad request"}},
        description="Allows authenticated users to add other users as friends by providing the friend's user ID."
    )
    def post(self, request, *args, **kwargs):
        # Ensure that the request context is passed to the serializer
        serializer = AddFriendSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        friend_id = serializer.validated_data['friend_id']

        if friend_id == request.user.id:
            return Response({"message": "You cannot delete yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(pk=friend_id)
            if friend not in request.user.friends.all():
                return Response({"message": "This user is not currently your friend"}, status=status.HTTP_400_BAD_REQUEST)
            request.user.friends.remove(friend)
            # Use HTTP 200 OK and send a success message
            return Response({"message": "Friend successfully deleted"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)