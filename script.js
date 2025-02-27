document.addEventListener("DOMContentLoaded", function () {
    const storeSelect = document.getElementById("store");
    const subcategorySelect = document.getElementById("subcategory");
    const productContainer = document.getElementById("productContainer");
    const quantityInput = document.getElementById("quantity");
    const summaryText = document.getElementById("summaryText");

    // Дүкендер, өнім түрлері және тауарлар
    const stores = {
        store: ["Азиз", "Мұхаммед", "Береке"],
        cafe: ["Burger House", "Coffee Time", "Pizza Place"],
        pharmacy: ["Дәру", "Жасыл дәріхана", "Шипа"]
    };

    const subcategories = {
        store: ["Киім", "Азық-түлік", "Тұрмыстық заттар"],
        cafe: ["Тамақ", "Напитки"],
        pharmacy: ["Дәрі-дәрмек", "Витаминдер"]
    };

    const products = {
        "Киім": [{ name: "Шорты", img: "shorts.png" }, { name: "Футболка", img: "tshirt.png" }],
        "Азық-түлік": [{ name: "Нан", img: "bread.png" }, { name: "Сүт", img: "milk.png" }],
        "Тамақ": [{ name: "Бургер", img: "burger.png" }, { name: "Пицца", img: "pizza.png" }],
        "Напитки": [{ name: "Шай", img: "tea.png" }, { name: "Кофе", img: "coffee.png" }],
        "Дәрі-дәрмек": [{ name: "Парацетамол", img: "paracetamol.png" }, { name: "Аспирин", img: "aspirin.png" }]
    };

    // Санатты таңдаған кезде дүкендер тізімін шығару
    window.selectCategory = function (category) {
        nextStep(2);
        storeSelect.innerHTML = '<option value="">Таңдаңыз...</option>';
        stores[category].forEach(store => {
            let option = new Option(store, store);
            storeSelect.add(option);
        });
        storeSelect.dataset.category = category; // Санатты сақтау
    };

    // Дүкен таңдаған кезде өнім түрлерін шығару
    storeSelect.addEventListener("change", function () {
        if (!storeSelect.value) return;
        nextStep(3);
        subcategorySelect.innerHTML = '<option value="">Таңдаңыз...</option>';
        subcategories[storeSelect.dataset.category].forEach(sub => {
            let option = new Option(sub, sub);
            subcategorySelect.add(option);
        });
    });

    // Өнім түрі таңдалған кезде өнімдер суреттерімен бірге шығуы
    subcategorySelect.addEventListener("change", function () {
        if (!subcategorySelect.value) return;
        nextStep(4);
        productContainer.innerHTML = "";

        // Егер таңдалған өнім түрі жоқ болса, ескерту шығару
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

    // Өнімді таңдаған кезде саны енгізілетін орын ашу
    window.selectProduct = function (productName) {
        localStorage.setItem("selectedProduct", productName);
        nextStep(5);
    };

    // "Жалғастыру" батырмасы басылғанда мәліметтерді жинау
    document.getElementById("continueBtn").addEventListener("click", function () {
        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        let address = document.getElementById("address").value;
        let time = document.getElementById("time").value;

        if (!name || !phone || !address || !time) {
            alert("Барлық өрістерді толтырыңыз!");
            return;
        }

        showSummary();
    });

    // Қорытындыны көрсету
    window.showSummary = function () {
        let summary = `
            <h3>Сіз мына тапсырысты бердіңіз:</h3>
            <p><b>Санат:</b> ${storeSelect.dataset.category}</p>
            <p><b>Дүкен:</b> ${storeSelect.value}</p>
            <p><b>Өнім:</b> ${localStorage.getItem("selectedProduct")}</p>
            <p><b>Саны:</b> ${quantityInput.value}</p>
            <p><b>Мекенжай:</b> ${document.getElementById("address").value}</p>
            <p><b>Телефон:</b> ${document.getElementById("phone").value}</p>
            <p><b>Жеткізу уақыты:</b> ${document.getElementById("time").value}</p>
        `;
        summaryText.innerHTML = summary;
        nextStep(7);
    };

    // Келесі қадамға өту функциясы
    window.nextStep = function (step) {
        document.querySelectorAll(".step").forEach(div => div.classList.add("hidden"));
        document.getElementById(`step${step}`).classList.remove("hidden");
    };
});
