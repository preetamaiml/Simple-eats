console.log("menu.js loaded");

// Wait until the HTML page is fully loaded
document.addEventListener("DOMContentLoaded", loadMenu);


// ------------------------------
// Load menu data from JSON
// ------------------------------

async function loadMenu() {

    try {

        const response = await fetch("data/menu.json");

        const menuItems = await response.json();

        displayMenu(menuItems);

    }

    catch (error) {

        console.error("Error loading menu:", error);

    }

}


// ------------------------------
// Display menu items
// ------------------------------

function displayMenu(menuItems) {

    const menuContainer = document.getElementById("menu-container");

    menuContainer.innerHTML = "";

    menuItems.forEach(item => {

        if (!item.available) {
            return;
        }

        const card = createFoodCard(item);

        menuContainer.appendChild(card);

    });

}


// ------------------------------
// Create one food card
// ------------------------------

function createFoodCard(item) {

    const card = document.createElement("div");

    card.classList.add("food-card");


    card.innerHTML = `

        <h3>${item.name}</h3>

        <p>${item.description}</p>

        <p><strong>₹${item.price}</strong></p>

        <p>⭐ ${item.rating} (${item.reviews} reviews)</p>

        <button>Add to Cart</button>

    `;


    const button = card.querySelector("button");


    button.addEventListener("click", function () {

        addToCart(item);

    });


    return card;
}

// ------------------------------
// Add item to cart
// ------------------------------

function addToCart(item) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];


    const existingItem = cart.find(cartItem => cartItem.id === item.id);


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });

    }


    localStorage.setItem("cart", JSON.stringify(cart));


    alert(`${item.name} added to cart!`);
}