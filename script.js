document.addEventListener("DOMContentLoaded", function () {
    const categorySelect = document.getElementById("category");
    const storeSelect = document.getElementById("store");
    const subcategorySelect = document.getElementById("subcategory");
    const productContainer = document.getElementById("productContainer");
    const quantityInput = document.getElementById("quantity");
    const summaryText = document.getElementById("summaryText");

    const registerForm = document.getElementById("registerForm");
    const userDisplay = document.getElementById("userDisplay");
    const logoutBtn = document.getElementById("logoutBtn");
    const usersList = document.getElementById("usersList");

    // ✅ Тіркелген қолданушыны көрсету
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
        if (userDisplay) {
            userDisplay.textContent = `Қош келдіңіз, ${currentUser}!`;
        }
        if (logoutBtn) {
            logoutBtn.style.display = "inline-block"; // Шығу батырмасын көрсету
        }
    }

    // ✅ Тіркелу формасы
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            if (name && email && password) {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                users.push({ name, email });
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", name); // Қазіргі қолданушыны сақтау

                alert("Тіркелу сәтті аяқталды!");
                window.location.href = "index.html"; // Басты бетке бағыттау
            }
        });
    }

    // ✅ Шығу (logout) функциясы
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "login.html"; // Кіру бетіне бағыттау
        });
    }

    // ✅ Тіркелген қолданушылар тізімін шығару
    if (usersList) {
        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.length === 0) {
            usersList.innerHTML = "<tr><td colspan='2'>Әзірге тіркелген қолданушылар жоқ</td></tr>";
        } else {
            users.forEach(user => {
                let row = document.createElement("tr");
                row.innerHTML = `<td>${user.name}</td><td>${user.email}</td>`;
                usersList.appendChild(row);
            });
        }
    }

    // ✅ Дүкен, өнім түрлері және тауарлар
    const stores = {
        store: ["Iftar", "Mini market," "Береке", "Jana Magazin", "Halyk Market"],
        cafe: ["Burger House", "Coffee Time", "Pizza Place", "Azizbek тойханасы"],
        pharmacy: ["Дәру", "Жасыл дәріхана", "Шипа"]
    };

    const subcategories = {
        store: ["Киім", "Азық-түлік", "Тұрмыстық заттар"],
        cafe: ["Тамақ", "Напитки"],
        pharmacy: ["Дәрі-дәрмек", "Витаминдер"]
    };

    const products = {
        "Киім": [{ name: "Шорты", img: "shorts.png" }, { name: "Футболка", png: "tshirt.png" }],
        "Азық-түлік": [{ name: "Нан", img: "bread.png" }, { name: "Сүт", png: "milk.png" }],
        "Тамақ": [{ name: "Бургер", img: "burger.png" }, { name: "Пицца", png: "pizza.png" }],
        "Напитки": [{ name: "Шай", img: "tea.png" }, { name: "Кофе", png: "coffee.png" }],
        "Дәрі-дәрмек": [{ name: "Парацетамол", png: "paracetamol.png" }, { name: "Аспирин", img: "aspirin.png" }]
    };

    // ✅ Санатты таңдаған кезде дүкендер тізімін шығару
    if (categorySelect) {
        categorySelect.addEventListener("change", function () {
            if (!categorySelect.value) return;
            nextStep(2);
            storeSelect.innerHTML = '<option value="">Таңдаңыз...</option>';
            stores[categorySelect.value].forEach(store => {
                let option = new Option(store, store);
                storeSelect.add(option);
            });
        });
    }

    // ✅ Дүкен таңдаған кезде өнім түрлерін шығару
    if (storeSelect) {
        storeSelect.addEventListener("change", function () {
            if (!storeSelect.value) return;
            nextStep(3);
            subcategorySelect.innerHTML = '<option value="">Таңдаңыз...</option>';
            subcategories[categorySelect.value].forEach(sub => {
                let option = new Option(sub, sub);
                subcategorySelect.add(option);
            });
        });
    }

    // ✅ Өнім түрі таңдалған кезде өнімдер суреттерімен бірге шығуы
    if (subcategorySelect) {
        subcategorySelect.addEventListener("change", function () {
            if (!subcategorySelect.value) return;
            nextStep(4);
            productContainer.innerHTML = "";

            if (!products[subcategorySelect.value]) {
                productContainer.innerHTML = "<p>Бұл санатта өнімдер жоқ.</p>";
                return;
            }

            products[subcategorySelect.value].forEach(product => {
                let div = document.createElement("div");
                div.className = "food-option";
                div.innerHTML = `<img src="${product.img}" onclick="selectProduct('${product.name}')"><p>${product.name}</p>`;
                productContainer.appendChild(div);
            });
        });
    }

    // ✅ Өнімді таңдаған кезде саны енгізілетін орын ашу
    if (document.getElementById("orderForm")) {
        document.getElementById("orderForm").addEventListener("submit", function (event) {
            event.preventDefault();
            showSummary();
        });
    }
});

// ✅ Келесі қадамға өту функциясы
function nextStep(step) {
    document.querySelectorAll(".step").forEach(div => div.classList.add("hidden"));
    document.getElementById(`step${step}`).classList.remove("hidden");
}

// ✅ Өнімді таңдау
function selectProduct(productName) {
    localStorage.setItem("selectedProduct", productName);
    nextStep(5);
}

// ✅ Қорытындыны көрсету
function showSummary() {
    let summary = `
        <h3>Сіз мына тапсырысты бердіңіз:</h3>
        <p><b>Санат:</b> ${document.getElementById("category").value}</p>
        <p><b>Дүкен:</b> ${document.getElementById("store").value}</p>
        <p><b>Өнім:</b> ${localStorage.getItem("selectedProduct")}</p>
        <p><b>Саны:</b> ${document.getElementById("quantity").value}</p>
        <p><b>Мекенжай:</b> ${document.getElementById("address").value}</p>
        <p><b>Телефон:</b> ${document.getElementById("phone").value}</p>
        <p><b>Жеткізу уақыты:</b> ${document.getElementById("time").value}</p>
    `;
    document.getElementById("summaryText").innerHTML = summary;
    nextStep(7);
}
