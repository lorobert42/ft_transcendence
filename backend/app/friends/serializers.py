from django.db.models import Q
from rest_framework import serializers

from core.models import User, FriendInvitation


class UserFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "avatar", "is_playing", "last_active"]


class FriendSerializer(serializers.ModelSerializer):
    friends = UserFriendSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ["friends"]


class InvitationSerializer(serializers.ModelSerializer):
    user1 = UserFriendSerializer(read_only=True)
    user2 = UserFriendSerializer(read_only=True)

    class Meta:
        model = FriendInvitation
        fields = '__all__'


class AcceptInvitationSerializer(serializers.Serializer):
    friend = UserFriendSerializer(read_only=True)
    response = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user: User = self.context["request"].user
        invitation = self.instance
        if invitation.user1 == user:
            raise serializers.ValidationError("You cannot accept your own invitations.")
        response = attrs.get("response")
        if response != "accept" and response != "refuse":
            raise serializers.ValidationError("Reply with accept or refuse.")
        attrs["user_object"] = user
        attrs["friend_object"] = invitation.user1
        attrs["response"] = response
        return super().validate(attrs)

    def update(self, instance, validated_data):
        user: User = validated_data.get("user_object")
        friend: User = validated_data.get("friend_object")
        response = validated_data.get("response")
        if response == "accept":
            user.friends.add(friend)
            friend.friends.add(user)
            user.save()
            friend.save()
        instance.delete()
        return user


class AddFriendSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(write_only=True)
    invitation = InvitationSerializer(read_only=True)

    def validate(self, attrs: dict):
        friend_id = attrs.get("user_id")
        user: User = self.context["request"].user
        if user.id == friend_id:
            raise serializers.ValidationError("You cannot add yourself.")
        friend: User = User.objects.filter(id=friend_id).first()
        if User.objects.filter(Q(id=user.id) & Q(friends__id=friend.id)):
            raise serializers.ValidationError("You are already friends.")
        if (FriendInvitation.objects.filter(
            (Q(user1=user.id) & Q(user2=friend.id)) |
            (Q(user2=user.id) & Q(user1=friend.id))
        ).exists()):
            raise serializers.ValidationError("Invitation already sent.")
        attrs["user1"] = user
        attrs["user2"] = friend
        return super().validate(attrs)

    def create(self, validated_data: dict):
        validated_data.pop("user_id")
        invitation = FriendInvitation.objects.create(**validated_data)
        return invitation
