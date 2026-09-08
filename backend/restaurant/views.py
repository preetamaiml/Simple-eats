from decimal import Decimal

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import MenuItem, Order, OrderItem


def menu_list(request):
    menu_items = MenuItem.objects.filter(
        available=True
    )

    data = []

    for item in menu_items:
        data.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "category": item.category,
            "available": item.available,
            "isSpecial": item.is_special,
            "prepTime": item.prep_time,
            "rating": float(item.rating),
            "reviews": item.reviews,
        })

    return JsonResponse(data, safe=False)


@csrf_exempt
def order_create(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed."},
            status=405
        )

    # We'll add the order creation logic here next.