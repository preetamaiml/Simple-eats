// Run when the page is fully loaded
document.addEventListener("DOMContentLoaded", loadCart);


// ------------------------------
// Load cart
// ------------------------------

function loadCart() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    displayCart(cart);
}


// ------------------------------
// Display cart
// ------------------------------

function displayCart(cart) {

    const cartContainer = document.getElementById("cart-container");
    const cartTotal = document.getElementById("cart-total");

    cartContainer.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "₹0";

        return;
    }


    cart.forEach(item => {

        const itemElement = document.createElement("div");

        itemElement.classList.add("cart-item");


        itemElement.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>₹${item.price} each</p>

            </div>


            <div class="cart-item-controls">

                <button class="decrease-button">−</button>

                <span>${item.quantity}</span>

                <button class="increase-button">+</button>

                <button class="remove-button">Remove</button>

            </div>

        `;


        // ------------------------------
        // Increase quantity
        // ------------------------------

        itemElement
            .querySelector(".increase-button")
            .addEventListener("click", function () {

                changeQuantity(item.id, 1);

            });


        // ------------------------------
        // Decrease quantity
        // ------------------------------

        itemElement
            .querySelector(".decrease-button")
            .addEventListener("click", function () {

                changeQuantity(item.id, -1);

            });


        // ------------------------------
        // Remove item
        // ------------------------------

        itemElement
            .querySelector(".remove-button")
            .addEventListener("click", function () {

                removeItem(item.id);

            });


        cartContainer.appendChild(itemElement);


        total += item.price * item.quantity;

    });


    cartTotal.textContent = `₹${total}`;
}


// ------------------------------
// Change quantity
// ------------------------------

function changeQuantity(itemId, change) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    const item = cart.find(cartItem => cartItem.id === itemId);


    if (!item) {
        return;
    }


    item.quantity += change;


    // Remove item if quantity reaches zero
    if (item.quantity <= 0) {

        const updatedCart = cart.filter(
            cartItem => cartItem.id !== itemId
        );

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );

        displayCart(updatedCart);

        return;
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart(cart);
}


// ------------------------------
// Remove item completely
// ------------------------------

function removeItem(itemId) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    const updatedCart = cart.filter(
        cartItem => cartItem.id !== itemId
    );


    localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
    );


    displayCart(updatedCart);
}