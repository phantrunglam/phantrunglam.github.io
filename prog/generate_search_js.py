import json

# Đọc dữ liệu từ persons_list.json
with open("persons_list.json", "r", encoding="utf-8") as f:
    persons_data = json.load(f)

# Tạo nội dung JavaScript
search_js_content = f"""
// Dữ liệu tìm kiếm được nhúng vào trực tiếp (không cần fetch)
const personsList = {json.dumps(persons_data, ensure_ascii=False, indent=4)};

// Hàm tìm kiếm
window.searchPerson = function() {{
    let searchInput = document.getElementById("search-input").value.toLowerCase();
    let searchResults = document.getElementById("search-results");

    if (!personsList || personsList.length === 0) {{
        console.error("❌ Danh sách personsList trống.");
        return;
    }}

    searchResults.innerHTML = "";

    if (searchInput.trim() === "") {{
        searchResults.style.display = "none";
        return;
    }}

    let selectedLang = localStorage.getItem("preferredLanguage") || "en";
    let results = personsList.filter(person => person.name.toLowerCase().includes(searchInput));

    if (results.length === 0) {{
        searchResults.style.display = "none";
        return;
    }}

    results.forEach(person => {{
        let resultItem = document.createElement("li");
        resultItem.innerHTML = `<a href="/languages/${{selectedLang}}/persons/Person_${{person.id}}.html">${{person.name}}</a>`;
        searchResults.appendChild(resultItem);
    }});

    searchResults.style.display = "block";
}};
"""

# Ghi vào search.js
with open("scripts/search.js", "w", encoding="utf-8") as f:
    f.write(search_js_content)

print("✅ Đã tạo search.js với dữ liệu tìm kiếm nhúng sẵn!")

