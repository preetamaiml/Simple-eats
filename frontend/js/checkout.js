// Run when the page is fully loaded
document.addEventListener("DOMContentLoaded", loadCheckout);


// ------------------------------
// Load checkout
// ------------------------------

function loadCheckout() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    displayOrderSummary(cart);

}


// ------------------------------
// Display order summary
// ------------------------------

function displayOrderSummary(cart) {

    const itemsContainer = document.getElementById("checkout-items");
    const totalElement = document.getElementById("checkout-total");

    itemsContainer.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";

        totalElement.textContent = "₹0";

        return;
    }


    cart.forEach(item => {

        const itemElement = document.createElement("div");

        itemElement.classList.add("checkout-item");

        const itemTotal = item.price * item.quantity;

        itemElement.innerHTML = `
            <span>
                ${item.name} × ${item.quantity}
            </span>

            <span>
                ₹${itemTotal}
            </span>
        `;

        itemsContainer.appendChild(itemElement);

        total += itemTotal;

    });


    totalElement.textContent = `₹${total}`;

}


// ------------------------------
// Place order
// ------------------------------

document
    .getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];


        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        const customerDetails = {

            name: document.getElementById("name").value,

            phone: document.getElementById("phone").value,

            email: document.getElementById("email").value,

            address: document.getElementById("address").value,

            city: document.getElementById("city").value,

            pincode: document.getElementById("pincode").value,

            instructions:
                document.getElementById("instructions").value

        };


        console.log("Customer:", customerDetails);

        console.log("Order:", cart);


        alert("Order placed successfully!");


        // Clear cart after order
        localStorage.removeItem("cart");

    });