"""
Django admin customizations
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.utils.http import urlencode
from django.utils.html import format_html

from core import models

class UserAdmin(BaseUserAdmin):
    """Custom user admin"""
    ordering = ['id']
    list_display = ['email', 'id', 'name']
    fieldsets = (
        (None, {'fields': ('email', 'password', 'otp_enabled')}),
        (('Personal Info'), {'fields': ('name',)}),
        (
            _('Permissions'),
            {'fields': ('is_active', 'is_staff', 'is_superuser')}
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'name',
                       'is_active', 'is_staff', 'is_superuser')
        }),
    )




admin.site.register(models.User, UserAdmin)
admin.site.register(models.Game)
admin.site.register(models.Tournament)
admin.site.register(models.Participation)
admin.site.register(models.FriendInvitation)
