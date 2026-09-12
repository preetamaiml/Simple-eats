document.addEventListener("DOMContentLoaded", loadOrder);

async function loadOrder() {

    const orderId = localStorage.getItem("lastOrderId");

    if (!orderId) {
        document.getElementById("order-info").innerHTML =
            "<p>No recent order found.</p>";
        return;
    }

    try {

        const response = await fetch(
            `https://ubiquitous-halibut-p7jwpv9qrp5v27qvw-8000.app.github.dev/api/orders/${orderId}/`
        );

        if (!response.ok) {
            throw new Error("Failed to load order.");
        }

        const order = await response.json();

        displayOrder(order);

    } catch (error) {

        console.error("Error loading order:", error);

        document.getElementById("order-info").innerHTML =
            "<p>Unable to load your order.</p>";
    }
}


function displayOrder(order) {

    const orderInfo = document.getElementById("order-info");
    const statusContainer = document.getElementById("order-status");

    orderInfo.innerHTML = `
        <h3>Order #${order.order_id}</h3>

        <p>
            <strong>Total:</strong>
            ₹${order.total_amount}
        </p>

        <h4>Items</h4>

        <ul>
            ${order.items.map(item => `
                <li>
                    ${item.name} × ${item.quantity}
                </li>
            `).join("")}
        </ul>
    `;

    statusContainer.innerHTML = `
        <h3>Status</h3>

        <p>
            ${formatStatus(order.status)}
        </p>
    `;
}


function formatStatus(status) {

    const statusNames = {
        pending: "Pending",
        confirmed: "Confirmed",
        preparing: "Preparing",
        ready: "Ready",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled"
    };

    return statusNames[status] || status;
}