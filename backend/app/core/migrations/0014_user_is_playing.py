# Generated by Django 5.0.4 on 2024-04-27 09:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_remove_friendinvitation_player1_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_playing',
            field=models.BooleanField(default=False),
        ),
    ]