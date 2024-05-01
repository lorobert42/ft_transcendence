"""
Database models
"""
from datetime import datetime, timedelta
from datetime import timezone as tz
from django.forms import ValidationError

from django.utils import timezone
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


def user_avatar_path(instance, filename):
    """
    Generates a unique file path for storing user avatar images.
    The path includes the user's ID to avoid filename conflicts.
    """
    # file will be uploaded to MEDIA_ROOT/user_avatars/user_<id>_<filename>
    return f'user_avatars/user_{instance.id}_{filename}'


class UserManager(BaseUserManager):
    """ Manager for user profiles """

    def create_user(self, email, password=None, **extra_fields):
        """Create a new user profile"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """Create and save a new superuser with given details"""
        user = self.create_user(email=email, password=password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that supports using email instead of username"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=25)
    is_active = models.BooleanField(default=True)
    is_playing = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to=user_avatar_path,  default='user_avatars/default-avatar.png')
    otp_enabled = models.BooleanField(default=False)
    otp_auth_url = models.CharField(max_length=225, blank=True, null=True)
    qr_code = models.ImageField(upload_to="qrcode/", blank=True, null=True)
    otp_base32 = models.CharField(max_length=255, null=True)
    login_otp_used = models.BooleanField(default=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)

    # Self-referencing ManyToManyField to represent friends
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    # New field for tracking the last active time
    last_active = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    @property
    def is_connected(self):
        """Determine if the user has been active in the last 5 minutes"""
        return timezone.now() - self.last_active <= timedelta(minutes=5)

    def is_valid_otp(self):
        lifespan_in_seconds = 90 if self.otp_enabled else 300
        now = datetime.now(tz.utc)
        time_diff = now - self.otp_created_at
        time_diff = time_diff.total_seconds()
        if time_diff >= lifespan_in_seconds or self.login_otp_used:
            return False
        return True


class Tournament(models.Model):
    name = models.CharField(max_length=512)
    participants = models.ManyToManyField('User', through='Participation', related_name='tournaments')
    has_started = models.BooleanField(default=False)

    def __str__(self):
        participant_names = ", ".join(p.user.name for p in self.participation_set.all())
        return f"{self.name} with players: {participant_names}"


class Participation(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('cancelled', 'Cancelled'),
    ), default='pending')

    class Meta:
        unique_together = ('user', 'tournament')  # Ensuring uniqueness at the database level

    def __str__(self):
        return f"({self.user.name}) - ({self.tournament.name})"


class Game(models.Model):
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.SET_NULL,
        related_name="games",
        null=True,
        blank=True
    )
    tournamentRound = models.IntegerField(
        default=0,
        null=True,
    )
    roundGame = models.IntegerField(
        default=0,
        null=True,
    )
    player1 = models.ForeignKey(
        'User',
        default=1,
        null=True,
        on_delete=models.CASCADE,
        related_name="games_as_player1"
    )
    player2 = models.ForeignKey(
        'User',
        default=2,
        null=True,
        on_delete=models.CASCADE,
        related_name="games_as_player2"
    )
    player1_status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending'),
        ('playing', 'Playing'),
    ), default='pending')
    player2_status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending'),
        ('playing', 'Playing'),
    ), default='pending')
    game_status = models.CharField(max_length=20, choices=(
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('canceled', 'Canceled'),
        ('finished', 'Finished'),
    ), default='pending')

    score1 = models.IntegerField(default=0,)
    score2 = models.IntegerField(default=0,)
    start_time = models.DateTimeField(null=True, default=None)

    def get_name(self):
        return f"{self.player1.name} vs {self.player2.name}"

    def clean(self):
        # Custom validation to ensure player1 and player2 are not the same
        if self.player1 == self.player2:
            raise ValidationError("Player1 and Player2 cannot be the same person.")

        # Ensure both players are part of the tournament if it's a tournament game
        if self.tournament:
            tournament_participants = self.tournament.participants.all()
            if not (self.player1 in tournament_participants and self.player2 in tournament_participants):
                raise ValidationError("Both players must be participants in the tournament.")

    def __str__(self):
        game_type = "Tournament Game" if self.tournament else "One-Off Game"
        return f"{self.player1.name} vs {self.player2.name}: {game_type}, Score [{self.score1} - {self.score2}]"


def get_system_user():
    return User.objects.get_or_create(email='system@user.com', defaults={'name': 'System User'})[0].pk


class FriendInvitation(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_invitations_as_user1', default=get_system_user)
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_invitations_as_user2', default=get_system_user)

    def __str__(self):
        return f"Friend Invitation from {self.user1.name} to {self.user2.name}"
