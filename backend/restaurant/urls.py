from django.urls import path
from . import views


urlpatterns = [
    path("menu/", views.menu_list, name="menu-list"),
    path("orders/", views.order_create, name="order-create"),
]