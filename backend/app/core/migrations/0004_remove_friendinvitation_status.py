# Generated by Django 5.0.4 on 2024-04-30 13:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_participation_nickname_participation_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friendinvitation',
            name='status',
        ),
    ]