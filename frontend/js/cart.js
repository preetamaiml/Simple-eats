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
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
            <p>Quantity: ${item.quantity}</p>
        `;

        cartContainer.appendChild(itemElement);

        total += item.price * item.quantity;

    });


    cartTotal.textContent = `₹${total}`;
}