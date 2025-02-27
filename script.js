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
    const usersTable = document.getElementById("usersTable"); // 🔹 Админ көретін бөлім

    // ✅ Тіркелген қолданушыны көрсету
    const currentUser = localStorage.getItem("currentUser");
    const currentRole = localStorage.getItem("currentRole"); // Рольді тексеру (админ бе, қолданушы ма)

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

            let role = "user"; // Әдепкі мән - қолданушы
            if (name.toLowerCase() === "admin") {
                role = "admin"; // Егер қолданушының аты "admin" болса, ол админ болады
            }

            if (name && email && password) {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                users.push({ name, email, role });
                localStorage.setItem("users", JSON.stringify(users));
                localStorage.setItem("currentUser", name);
                localStorage.setItem("currentRole", role); // 🔹 Рөлді сақтау

                alert("Тіркелу сәтті аяқталды!");
                window.location.href = "bastybet.html"; // Басты бетке бағыттау
            }
        });
    }

    // ✅ Шығу (logout) функциясы
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("currentRole"); // 🔹 Рөлді өшіру
            window.location.href = "login.html"; // Кіру бетіне бағыттау
        });
    }

    // ✅ Тіркелген қолданушылар тізімін шығару (тек **АДМИН** көре алады)
    if (usersTable) {
        if (currentRole === "admin") {
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
        } else {
            usersTable.style.display = "none"; // Егер админ болмаса, кестені жасыру
        }
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
