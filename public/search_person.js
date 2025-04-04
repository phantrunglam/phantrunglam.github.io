document.addEventListener("DOMContentLoaded", function () {
  // Tạo container search global
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

  // Thêm Select2 vào container
  searchContainer.innerHTML = `
      <select id="global_search" class="js-global-search" style="width:100%">
        <option value=""></option>
      </select>
    `;
  document.body.appendChild(searchContainer);

  // API cho menu.js
  window.personSearchAPI = {
    activate: function () {
      searchContainer.style.display = "block";
      $("#global_search").select2("open");
      return true;
    },
    personList: null,
  };

  // Load dữ liệu
  fetch("/scripts/person_list.json")
    .then((response) => response.json())
    .then((personList) => {
      window.personSearchAPI.personList = personList;

      // Khởi tạo Select2
      $("#global_search").select2({
        placeholder: "Tìm kiếm thành viên...",
        width: "100%",
        minimumInputLength: 1,
        data: personList.map((person) => ({
          id: person.person_id,
          text: formatPersonText(person),
          person: person,
        })),
        templateResult: formatPersonDisplay,
        templateSelection: formatPersonDisplay,
        escapeMarkup: function (markup) {
          return markup;
        },
      });

      // Xử lý khi chọn
      $("#global_search").on("select2:select", function (e) {
        const person = e.params.data.person;
        window.location.href = `/languages/vn/persons/Person_${person.person_id}.html`;
      });
    })
    .catch((error) => {
      console.error("Lỗi tải danh sách:", error);
      window.personSearchAPI.personList = [];
    });

  // Các hàm format
  function formatPersonText(person) {
    let text = `${person.person_name} (${person.person_id})`;
    if (person.person_birthday?.trim()) {
      text += ` - ${person.person_birthday}`;
    }
    return text;
  }

  function formatPersonDisplay(item) {
    if (!item.id) return item.text;
    const p = item.person || item;
    return $(`
        <div class="person-option">
          <span class="person-name">${p.person_name}</span>
          <span class="person-id">${p.person_id}</span>
          ${
            p.person_birthday
              ? `<span class="person-birth">${p.person_birthday}</span>`
              : ""
          }
        </div>
      `);
  }

  // CSS cho dropdown
  const style = document.createElement("style");
  style.textContent = `
      .select2-container--open .select2-dropdown {
        z-index: 1001;
        max-height: 60vh;
        overflow-y: auto;
      }
      .select2-results__option {
        padding: 8px 6px;
      }
      .person-option {
        padding: 5px 0;
      }
      .person-name {
        font-weight: bold;
        display: block;
      }
      .person-id, .person-birth {
        font-size: 0.85em;
        color: #666;
        display: inline-block;
        margin-right: 10px;
      }
    `;
  document.head.appendChild(style);
});
