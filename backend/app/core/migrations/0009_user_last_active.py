# Generated by Django 5.0.4 on 2024-04-16 14:01

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_alter_user_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_active',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]