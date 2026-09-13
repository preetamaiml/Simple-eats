let statusInterval;


document.addEventListener("DOMContentLoaded", function() {

    loadOrder();

    statusInterval = setInterval(loadOrder, 10000);

});

async function loadOrder() {
    console.log("Checking order status:", new Date().toLocaleTimeString());

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

        // Stop checking once the order reaches a final state
        if (
            order.status === "delivered" ||
            order.status === "cancelled"
        ) {
            clearInterval(statusInterval);
        }

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

    statusContainer.innerHTML = createStatusTimeline(order.status);
}


function createStatusTimeline(currentStatus) {

    const statuses = [
        {
            key: "pending",
            label: "Order Placed"
        },
        {
            key: "confirmed",
            label: "Confirmed"
        },
        {
            key: "preparing",
            label: "Preparing"
        },
        {
            key: "ready",
            label: "Ready"
        },
        {
            key: "out_for_delivery",
            label: "Out for Delivery"
        },
        {
            key: "delivered",
            label: "Delivered"
        }
    ];

    const currentIndex = statuses.findIndex(
        status => status.key === currentStatus
    );

    return `
        <h3>Order Status</h3>

        <div class="status-timeline">

            ${statuses.map((status, index) => {

                let className = "";

                if (index < currentIndex) {
                    className = "completed";
                } else if (index === currentIndex) {
                    className = "current";
                }

                return `
                    <div class="status-step ${className}">

                        <div class="status-circle">
                            ${index <= currentIndex ? "✓" : ""}
                        </div>

                        <div class="status-label">
                            ${status.label}
                        </div>

                    </div>
                `;

            }).join("")}

        </div>
    `;
}