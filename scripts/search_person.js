document.addEventListener("DOMContentLoaded", function () {
  const searchContainer = document.createElement("div");
  searchContainer.className = "global-search-container";
  searchContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: none;
        width: 80%;
        max-width: 600px;
    `;

  searchContainer.innerHTML = `
        <input type="text" id="search_input" placeholder="Tìm kiếm thành viên..." 
               style="width: 100%; padding: 10px; font-size: 16px;">
        <div class="search-dropdown" style="
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 5px;
            max-height: 60vh;
            overflow-y: auto;
            display: none;
        "></div>
    `;

  document.body.appendChild(searchContainer);

  const searchInput = document.getElementById("search_input");
  const searchResults = document.querySelector(".search-dropdown");

  // API hỗ trợ cho menu.js
  window.personSearchAPI = {
    activate: function () {
      searchContainer.style.display = "block";
      searchInput.style.display = "block";
      searchInput.focus();
      return true;
    },

    search: function (query) {
      return new Promise((resolve) => {
        const results = this.filterPersons(query);
        resolve(results);
      });
    },

    filterPersons: function (query) {
      if (!this.personList || query.length < 2) return [];

      return this.personList.filter(
        (person) =>
          person.person_name.toLowerCase().includes(query.toLowerCase()) ||
          person.person_id.toLowerCase().includes(query.toLowerCase()) ||
          (person.person_birthday && person.person_birthday.includes(query))
      );
    },

    personList: null,
  };

  // Load dữ liệu
  fetch("/scripts/person_list.json")
    .then((response) => response.json())
    .then((personList) => {
      window.personSearchAPI.personList = personList;

      searchInput.addEventListener("input", function () {
        const query = this.value.trim();
        searchResults.innerHTML = "";

        const results = window.personSearchAPI.filterPersons(query);

        if (results.length === 0) {
          searchResults.style.display = "none";
          return;
        }

        results.forEach((person) => {
          const item = document.createElement("div");
          item.className = "search-result-item";
          item.innerHTML = `
                        <a href="/languages/vn/persons/Person_${person.person_id}.html"
                           style="display: block; padding: 10px; color: #333; text-decoration: none;">
                            ${person.person_name} (${person.person_birthday})
                        </a>
                    `;
          searchResults.appendChild(item);
        });

        searchResults.style.display = "block";
      });
    })
    .catch((error) => {
      console.error("Error loading person list:", error);
      window.personSearchAPI.personList = [];
    });
});
