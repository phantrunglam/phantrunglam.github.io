function checkLanguage() {
    var language = window.navigator.language || window.navigator.userLanguage;
    var savedLanguage = localStorage.getItem("preferredLanguage");

    if (savedLanguage) {
        redirectToLanguage(savedLanguage);
        return;
    }

    for (var i = 0; i < languageData.length; i++) {
        var languageKey = languageData[i].languageKey;
        
        if (language.indexOf(languageKey) !== -1) {
            localStorage.setItem("preferredLanguage", languageKey);
            redirectToLanguage(languageKey);
            return;
        }
    }

    // Nếu không tìm thấy, mặc định về English
    redirectToLanguage("en");
}

function redirectToLanguage(lang) {
    for (var i = 0; i < languageData.length; i++) {
        if (languageData[i].languageKey === lang) {
            document.location.href = languageData[i].linkKey;
            return;
        }
    }
}

// ✅ Thêm hàm này để người dùng có thể chọn ngôn ngữ bằng tay
function setLanguage(lang) {
    // console.log("🔹 Chọn ngôn ngữ:", lang); // Debug

    // Lưu ngôn ngữ vào localStorage
    localStorage.setItem("preferredLanguage", lang);
    // console.log("✅ Ngôn ngữ đã lưu:", localStorage.getItem("preferredLanguage"));

    // Chuyển đến trang phù hợp
    document.location.href = "languages/" + lang + "/index.html";
}

/* function goToPage(page) {
    var preferredLanguage = localStorage.getItem("preferredLanguage") || "en";
    var newUrl = "languages/" + preferredLanguage + "/" + page;
    
    // console.log("🔹 Chuyển hướng đến:", newUrl);
    document.location.href = newUrl;
} */

function goToPage(page) {
    var preferredLanguage = localStorage.getItem("preferredLanguage");

    // Nếu chưa có preferredLanguage, mặc định là "en"
    if (!preferredLanguage) {
        preferredLanguage = "en";
        localStorage.setItem("preferredLanguage", "en");  // Lưu lại
    }

    var newUrl = "languages/" + preferredLanguage + "/" + page;
    // console.log("🔹 Chuyển hướng đến:", newUrl); // Debug

    document.location.href = newUrl;
}

function loadLanguageMenu() {
    // Xác định đường dẫn tới thư mục gốc của `languages/`
    var pathParts = window.location.pathname.split("/");
    var basePath = "/languages"; // Luôn trỏ đến thư mục languages

    fetch(basePath + "/languageMenu.html")
        .then(response => {
            if (!response.ok) {
                throw new Error("Lỗi tải menu ngôn ngữ");
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error("❌ Lỗi tải menu ngôn ngữ:", error));
}

// Gọi hàm để nhúng menu vào tất cả các trang
document.addEventListener("DOMContentLoaded", loadLanguageMenu);