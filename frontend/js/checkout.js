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
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem("cart")) || [];


        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        const customerDetails = {

            customer_name: document.getElementById("name").value,

            phone: document.getElementById("phone").value,

            email: document.getElementById("email").value,

            address: document.getElementById("address").value,

            city: document.getElementById("city").value,

            pincode: document.getElementById("pincode").value,

            instructions:
                document.getElementById("instructions").value

        };


        const orderItems = cart.map(item => ({

            menu_item_id: item.id,

            quantity: item.quantity

        }));


        const orderData = {

            ...customerDetails,

            items: orderItems

        };


        try {

            const response = await fetch(
                "https://ubiquitous-halibut-p7jwpv9qrp5v27qvw-8000.app.github.dev/api/orders/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(orderData)
                }
            );


            const result = await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error || "Failed to place order."
                );

            }


            console.log("Order created:", result);


            alert(
                `Order #${result.order_id} placed successfully!`
            );


            localStorage.setItem("lastOrderId", result.order_id);
            // Clear cart only after successful order
            localStorage.removeItem("cart");


            // Return customer to menu
            window.location.href = "order-tracking.html";


        } catch (error) {

            console.error("Error placing order:", error);

            alert(
                "There was a problem placing your order. Please try again."
            );

        }

    });