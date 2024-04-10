"""
Database models
"""
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
    # file will be uploaded to MEDIA_ROOT/user_avatars/user_<id>/<filename>
    return f'user_avatars/user_{instance.id}/{filename}'

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
    is_staff = models.BooleanField(default=False)
    avatar = models.ImageField(null=True,  blank=True,  upload_to='user_avatars/')

    objects = UserManager()

    USERNAME_FIELD = 'email'


class Room(models.Model):
    name = models.CharField(max_length=128)
    participants = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def get_participants_count(self):
        return self.participants.count()

    def join(self, user):
        self.participants.add(user)
        self.save()

    def leave(self, user):
        self.participants.remove(user)
        self.save()

    def __str__(self):
        return f'{self.name} ({self.get_participants_count()})'


class Message(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    room = models.ForeignKey(to=Room, on_delete=models.CASCADE)
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.email}: {self.content} [{self.timestamp}]'


class GameRoom(models.Model):
    """GameRoom info"""
    name = models.CharField(max_length=255)
    user = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name}'


class Game(models.Model):
    name = models.CharField(max_length=255)
    user = models.ManyToManyField(User, through="GameInfo")
    game_room = models.ForeignKey(to=GameRoom, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name}: [{self.game_room.name}]"


class GameInfo(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    game = models.ForeignKey(to=Game, on_delete=models.CASCADE)
    score = models.IntegerField()
    has_won = models.BooleanField()

    def __str__(self):
        return f"{self.game.name} : [{self.user.name} | {self.score}]"
