from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'mobile_number', 'is_verified', 'date_joined')
    search_fields = ('username', 'email', 'mobile_number')
    list_filter = ('is_verified', 'is_active', 'date_joined')
    ordering = ('-date_joined',)

admin.site.register(CustomUser, CustomUserAdmin)
