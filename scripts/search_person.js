document.addEventListener("DOMContentLoaded", function () {
    let searchInput = document.getElementById("search_input");
    let searchResults = document.querySelector(".search-dropdown");

    if (!searchInput || !searchResults) {
        console.error("Search input or results container not found!");
        return;
    }

    fetch("/scripts/person_list.json")
        .then(response => response.json())
        .then(personList => {
            searchInput.addEventListener("input", function () {
                let query = this.value.toLowerCase().trim();
                searchResults.innerHTML = "";

                if (query.length < 2) { // Chỉ tìm kiếm nếu có ít nhất 2 ký tự
                    searchResults.style.display = "none";
                    return;
                }

                let filteredPersons = personList.filter(person =>
                    person.person_name.toLowerCase().includes(query) ||
                    person.person_id.toLowerCase().includes(query) ||
                    person.person_birthday.includes(query)
                );

                if (filteredPersons.length === 0) {
                    // Hiển thị thông báo "không tìm thấy"
                    let noResultItem = document.createElement("div");
                    noResultItem.classList.add("search-result-item", "no-result");
                    noResultItem.textContent = "Không tìm thấy kết quả phù hợp";
                    searchResults.appendChild(noResultItem);
                    searchResults.style.display = "block";
                    return;
                }

                filteredPersons.forEach(person => {
                    let resultItem = document.createElement("div");
                    resultItem.classList.add("search-result-item");
                    
                    // Tạo chuỗi HTML với highlight cho tên
                    let highlightedName = highlightText(person.person_name, query);
                    let highlightedId = highlightText(person.person_id, query);
                    let highlightedBirthday = highlightText(person.person_birthday, query);
                    
                    resultItem.innerHTML = `<a href="/languages/vn/persons/Person_${person.person_id}.html">
                        ${highlightedName} (${person.person_birthday})
                    </a>`;
                    searchResults.appendChild(resultItem);
                });

                searchResults.style.display = "block";
            });

            // Hàm highlight các ký tự trùng khớp
            function highlightText(text, query) {
                if (!query) return text;
                
                const regex = new RegExp(`(${query})`, 'gi');
                return text.replace(regex, '<span class="highlight">$1</span>');
            }
        })
        .catch(error => console.error("Error loading person list:", error));
});