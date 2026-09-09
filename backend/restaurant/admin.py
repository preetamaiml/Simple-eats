from django.contrib import admin
from .models import MenuItem, Order, OrderItem


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

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "phone",
        "total_amount",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "customer_name",
        "phone",
        "email",
    )

    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = (
        "order",
        "menu_item",
        "quantity",
        "price",
    )