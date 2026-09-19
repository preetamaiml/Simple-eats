import json
from decimal import Decimal

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import MenuItem, Order, OrderItem
from django.shortcuts import get_object_or_404

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail


@csrf_exempt
def register(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST requests are allowed."},
            status=405
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400
        )

    username = data.get("username", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not username or not email or not password:
        return JsonResponse(
            {"error": "Username, email and password are required."},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"error": "Username already exists."},
            status=400
        )

    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {"error": "Email already registered."},
            status=400
        )

    try:
        validate_password(password)
    except ValidationError as error:
        return JsonResponse(
            {"error": error.messages},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    user.is_active = False
    user.save()

    token = default_token_generator.make_token(user)

    verification_url = (
        "http://localhost:5500/verify-email.html"
        f"?user_id={user.id}&token={token}"
    )

    send_mail(
        subject="Verify your Simple Eats account",
        message=(
            "Welcome to Simple Eats!\n\n"
            "Please verify your email by clicking the link below:\n\n"
            f"{verification_url}\n\n"
            "If you did not create this account, you can ignore this email."
        ),
        from_email="noreply@simpleeats.com",
        recipient_list=[user.email],
    )

    return JsonResponse(
        {
            "message": "Registration successful. Please check your email."
        },
        status=201
    )


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

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid JSON."},
            status=400
        )

    customer_name = data.get("customer_name")
    phone = data.get("phone")
    email = data.get("email")
    address = data.get("address")
    city = data.get("city")
    pincode = data.get("pincode")
    instructions = data.get("instructions", "")
    items = data.get("items", [])

    if not all([
        customer_name,
        phone,
        email,
        address,
        city,
        pincode
    ]):
        return JsonResponse(
            {"error": "Missing required customer information."},
            status=400
        )

    if not items:
        return JsonResponse(
            {"error": "Order must contain at least one item."},
            status=400
        )

    total_amount = Decimal("0")
    order_items = []

    for item in items:

        menu_item_id = item.get("menu_item_id")
        quantity = item.get("quantity")

        if not menu_item_id or not quantity or quantity <= 0:
            return JsonResponse(
                {"error": "Invalid order item."},
                status=400
            )

        try:
            menu_item = MenuItem.objects.get(
                id=menu_item_id,
                available=True
            )
        except MenuItem.DoesNotExist:
            return JsonResponse(
                {"error": f"Menu item {menu_item_id} is unavailable."},
                status=400
            )

        price = menu_item.price

        total_amount += price * quantity

        order_items.append({
            "menu_item": menu_item,
            "quantity": quantity,
            "price": price
        })

    order = Order.objects.create(
        customer_name=customer_name,
        phone=phone,
        email=email,
        address=address,
        city=city,
        pincode=pincode,
        instructions=instructions,
        total_amount=total_amount
    )

    for item in order_items:
        OrderItem.objects.create(
            order=order,
            menu_item=item["menu_item"],
            quantity=item["quantity"],
            price=item["price"]
        )

    return JsonResponse({
        "message": "Order created successfully.",
        "order_id": order.id,
        "total_amount": float(order.total_amount),
        "status": order.status
    }, status=201)



def order_detail(request, order_id):

    if request.method != "GET":
        return JsonResponse(
            {"error": "Only GET requests are allowed."},
            status=405
        )

    order = get_object_or_404(Order, id=order_id)

    data = {
        "order_id": order.id,
        "customer_name": order.customer_name,
        "total_amount": float(order.total_amount),
        "status": order.status,
        "created_at": order.created_at,
        "items": []
    }

    for item in order.items.all():
        data["items"].append({
            "name": item.menu_item.name,
            "quantity": item.quantity,
            "price": float(item.price),
        })

    return JsonResponse(data)