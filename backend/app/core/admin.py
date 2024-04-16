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


@admin.register(models.Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'id', 'view_participants_link']

    def view_participants_link(self, obj):
        count = obj.participants.count()
        url = (
            reverse("admin:core_user_changelist")
            + "?"
            + urlencode({"room__id": f"{obj.id}"})
        )
        return format_html('<a href="{}">{} participants</a>', url, count)

    view_participants_link.short_description = "participants"


@admin.register(models.GameRoom)
class GameRoomAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Message)
admin.site.register(models.Game)
admin.site.register(models.GameInfo)
