function createLanguageMenu() {
    const menuHTML = `
        <div id="language-menu" style="padding: 10px; background-color: #f0f0f0;">
            <label for="language-select">Chọn ngôn ngữ:</label>
            <select id="language-select">
                <option value="/languages/en/">English</option>
                <option value="/languages/vn/">Tiếng Việt</option>
            </select>
        </div>
    `;
    return menuHTML;
}

function handleLanguageChange(event) {
    const selectedLanguage = event.target.value;
    window.location.href = selectedLanguage;
}

function loadLanguageMenu() {
    console.log('Hàm loadLanguageMenu đã được gọi!'); // Thêm dòng này
    const menu = createLanguageMenu();
    document.body.insertAdjacentHTML('afterbegin', menu);

    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', handleLanguageChange);
}

document.addEventListener('DOMContentLoaded', loadLanguageMenu);