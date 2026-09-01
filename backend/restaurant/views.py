from django.http import JsonResponse
from .models import MenuItem


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