# Generated by Django 5.0.4 on 2024-04-28 14:21

import core.models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=25)),
                ('is_active', models.BooleanField(default=True)),
                ('is_playing', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('avatar', models.ImageField(default='user_avatars/default-avatar.png', upload_to=core.models.user_avatar_path)),
                ('otp_enabled', models.BooleanField(default=False)),
                ('otp_auth_url', models.CharField(blank=True, max_length=225, null=True)),
                ('qr_code', models.ImageField(blank=True, null=True, upload_to='qrcode/')),
                ('otp_base32', models.CharField(max_length=255, null=True)),
                ('login_otp_used', models.BooleanField(default=True)),
                ('otp_created_at', models.DateTimeField(blank=True, null=True)),
                ('last_active', models.DateTimeField(default=django.utils.timezone.now)),
                ('friends', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='FriendInvitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('user1', models.ForeignKey(default=core.models.get_system_user, on_delete=django.db.models.deletion.CASCADE, related_name='friend_invitations_as_user1', to=settings.AUTH_USER_MODEL)),
                ('user2', models.ForeignKey(default=core.models.get_system_user, on_delete=django.db.models.deletion.CASCADE, related_name='friend_invitations_as_user2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score1', models.IntegerField(default=0)),
                ('score2', models.IntegerField(default=0)),
                ('is_archived', models.BooleanField(default=False)),
                ('player1', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='games_as_player2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GameInvitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('running', 'Running'), ('finished', 'Finished'), ('declined', 'Declined'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='invitations', to='core.game')),
                ('player1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_invitations_as_player1', to=settings.AUTH_USER_MODEL)),
                ('player2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_invitations_as_player2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=512)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('participants', models.ManyToManyField(related_name='chat_rooms', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.CharField(max_length=512)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.room')),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('participants', models.ManyToManyField(through='core.Participation', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='participation',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tournament'),
        ),
        migrations.AddField(
            model_name='game',
            name='tournament',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='games', to='core.tournament'),
        ),
        migrations.CreateModel(
            name='TournamentInvitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.tournament')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='participation',
            unique_together={('user', 'tournament')},
        ),
    ]
