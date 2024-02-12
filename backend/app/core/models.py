"""
Database models
"""
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


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
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

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


"""
#########################
        GAME INFO
#########################
"""


class Ball(models.Model):
    MAX_VEL = 10
    MAX_VEL_Y = 15

    def __init__(self, x, y, rad):
        self.x = self.origin_x = x
        self.x = self.origin_x = x
        self.rad = rad
        self.x_vel = self.MAX_VEL
        self.y_vel = 0

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.origin_x
        self.y = self.origin_y
        self.x_vel *= -1
        self.y_vel = 0


class Paddle(models.Model):
    """Paddle class"""
    VEL = 10

    def __init__(self, x, y, width, height):
        self.x = x
        self.y = y
        self.width = width
        self.heigth = height

    def move(self, up=True):
        if up:
            self.y -= self.VEL
        else:
            self.y += self.VEL


class GameRoom(models.Model):
    """GameRoom info"""
    Users = models.ManyToManyField(User)
    created_at = models.DateTimeField(auto_now_add=True)
    name_room = models.CharField(max_length=255)

    WIDTH, HEIGHT = 1000, 700  # Game size
    PADDLE_WIDTH, PADDLE_HEIGHT = 25, 125  # Paddle size
    D_BALL_RAD = 10  # Radius of the ball

    ball = Ball(WIDTH // 2, HEIGHT // 2, D_BALL_RAD)
    paddle_left = Paddle(20, HEIGHT / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH,
                         PADDLE_HEIGHT)
    right_paddle = Paddle(WIDTH - 20 - PADDLE_WIDTH, HEIGHT / 2 - PADDLE_HEIGHT / 2,
                          PADDLE_WIDTH, PADDLE_HEIGHT)

    def handle_collision(ball, left, right):
        """ Change the ball direction if it hit the ceiling """
        if ball.y + ball.rad >= HEIGHT or ball.y - ball.rad == 0:
            ball.x_vel *= -1

        # Cheking the direction of the ball
        if ball.x_vel < 0:
            # Ball goes left to right ->
            if ball.y >= left.y and ball.y <= left.y + left.height and \
                    ball.x - ball.rad <= left.x + left.width:
                # Ball is hitting the left_paddle
                middle_y = left.y + left.height / 2
                difference_in_y = middle_y - ball.y
                reduction_factor = (left.heigth / 2) / ball.MAX_VEL_Y
                y_vel = difference_in_y / reduction_factor
                ball.y_vel = -1 * y_vel
                # Will change the velocity of the ball depending of where the
                # Ball is hitting the paddle

        else:
            # Ball goes right to left <-
            if ball.y >= rigth.y and ball.y <= right.y + right.heigth and \
                    ball.x + ball.rad >= right.x:
                # Ball is hitting the rigth_paddle
                middle_y = right.x + right.height / 2
                difference_in_y = middle_y - ball.y
                reduction_factor = (right.height / 2) / ball.MAX_VEL_Y
                y_vel = difference_in_y / reduction_factor
                ball.y_vel = -1 * y_vel
                # Will change the velocity of the ball depending of where the
                # Ball is hitting the paddle

    def handle_paddle_move(key, left, right):
        """ """
        if key is KEY_W and left.y - left.VEL >= 0:
            left.move(up=True)
        if key is KEY_S and left.y + left.VEL + left.height <= HEIGHT:
            left.move(up=False)
        if key is KEY_I and right.y - right.VEL >= 0:
            right.move(up=True)
        if key is KEY_K and right.y + right.VEL + right.height <= HEIGHT:
            right.move(up=False)

    """
    The logic for the game is:

        while (game.on):
            for event:
                if event == QUIT:
                    break

            key = key_pressed
            handle_paddle_move(key, left_paddle, right_paddle)
            ball.move()
            handle_collision(ball, left_paddle, right_paddle)

            if ball.x < 0:
                ball.reset()
                score_r++
            elif ball.x > WIDTH:
                ball.reset()
                score_l++

            if score_r == limit or score_l == limit:
                stop_game
                break
    """
