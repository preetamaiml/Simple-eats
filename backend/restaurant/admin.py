from django.contrib import admin
from .models import MenuItem


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "category",
        "available",
        "is_special",
        "rating",
    )

    list_filter = (
        "available",
        "is_special",
        "category",
    )

    search_fields = (
        "name",
        "description",
    )