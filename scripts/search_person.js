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
                let query = this.value.toLowerCase();
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
                    searchResults.style.display = "none";
                    return;
                }

                filteredPersons.forEach(person => {
                    let resultItem = document.createElement("div");
                    resultItem.classList.add("search-result-item");
                    resultItem.innerHTML = `<a href="/languages/vn/persons/Person_${person.person_id}.html">

                        ${person.person_name} (${person.person_birthday})
                    </a>`;
                    searchResults.appendChild(resultItem);
                });

                searchResults.style.display = "block";
            });
        })
        .catch(error => console.error("Error loading person list:", error));
});