// menu.js - Phiên bản đơn giản hóa
document.addEventListener("DOMContentLoaded", function () {
  // Tạo menu HTML
  const menuHTML = `
  <ul id="menu_row_id">
      <li class="menu_item active_menu_item" data-tooltip="Trang chủ gia phả">
          <a href="/languages/vn/index.html">Trang chủ</a>
      </li>
      <li class="menu_item" data-tooltip="Danh sách thành viên họ tộc">
          <a href="/languages/vn/personlist.html">Họ tộc</a>
      </li>
      <li class="menu_item" data-tooltip="Danh sách các gia đình">
          <a href="/languages/vn/familylist.html">Gia đình</a>
      </li>
      <li class="menu_item" data-tooltip="Các phả đồ gia phả">
          <a href="/languages/vn/chartlist.html">Phả đồ</a>
      </li>
      <li class="menu_item" data-tooltip="Nguồn tài liệu tham khảo">
          <a href="/languages/vn/sourcelist.html">Nguồn tham chiếu</a>
      </li>
      <li class="menu_item search-parent-item" data-tooltip="Tìm kiếm">
          <a href="#" id="search-trigger">
              <span class="search-icon">🔍</span>
              <span class="search-text">Tìm kiếm</span>
          </a>
          <ul class="search-submenu">
              <li><a href="#" class="search-option" data-type="person">🔎 Tìm người</a></li>
              <li><a href="#" class="search-option" data-type="birthday">🎂 Sinh nhật tháng</a></li>
              <li><a href="#" class="search-option" data-type="anniversary">🕯️ Ngày giỗ quý</a></li>
              <li><a href="#" class="search-option" data-type="report">📊 Xuất báo cáo</a></li>
              <li><a href="/languages/vn/statistics.html">Thống kê</a></li>
          </ul>
      </li>
      <li class="menu_item" data-tooltip="Liên hệ quản trị viên">
          <a href="/languages/vn/contact.html">Liên hệ</a>
      </li>
      <li class="menu_item" data-tooltip="Hướng dẫn sử dụng" id="help-trigger">
          <a href="#">Trợ giúp</a>
      </li>
      <li class="menu_item" data-tooltip="Quay lại trang trước">
          <button id="back_button" onclick="window.history.back();">⬅ Back</button>
      </li>
  </ul>
  `;

  // Chèn menu vào container
  const menuContainer = document.getElementById("menu_id");
  if (menuContainer) {
    menuContainer.innerHTML = menuHTML;
    initTooltips();
    setupHelpModal();
    setupResponsiveMenu();
    setupSearchFunctionality();
  }

  highlightActiveMenu();
});

// ========================
// CÁC HÀM CHỨC NĂNG CHÍNH
// ========================

function initTooltips() {
  const style = document.createElement("style");
  style.textContent = `
      .menu_item {
          position: relative;
      }
      .menu_item::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #333;
          color: #fff;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
          z-index: 100;
          pointer-events: none;
      }
      .menu_item:hover::after {
          opacity: 1;
          visibility: visible;
      }
      @media (max-width: 768px) {
          .menu_item::after {
              display: none;
          }
      }
  `;
  document.head.appendChild(style);
}

function setupHelpModal() {
  const trigger = document.getElementById("help-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", function (e) {
    e.preventDefault();
    const modal = document.createElement("div");
    modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.7);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
      `;

    modal.innerHTML = `
          <div style="background: white; width: 80%; max-width: 800px; height: 80vh; border-radius: 8px; overflow: hidden;">
              <div style="padding: 15px; background: #2c3e50; color: white; display: flex; justify-content: space-between;">
                  <h2 style="margin: 0;">Hướng Dẫn Sử Dụng</h2>
                  <span onclick="this.parentElement.parentElement.parentElement.remove()" 
                        style="font-size: 24px; cursor: pointer;">&times;</span>
              </div>
              <iframe src="/languages/vn/help/help.html" style="width: 100%; height: calc(100% - 50px); border: none;"></iframe>
          </div>
      `;

    document.body.appendChild(modal);
  });
}

function setupResponsiveMenu() {
  const menu = document.getElementById("menu_row_id");
  if (!menu) return;

  function checkViewport() {
    if (window.innerWidth <= 768) {
      // Mobile
      if (!document.getElementById("hamburger-btn")) {
        const hamburger = document.createElement("button");
        hamburger.id = "hamburger-btn";
        hamburger.innerHTML = "☰ Menu";
        hamburger.style.cssText = `
                  display: block;
                  width: 100%;
                  padding: 10px;
                  background: #2c3e50;
                  color: white;
                  border: none;
                  font-size: 16px;
                  cursor: pointer;
              `;
        menu.parentNode.insertBefore(hamburger, menu);
        hamburger.addEventListener("click", () => {
          menu.style.display = menu.style.display === "none" ? "flex" : "none";
        });
      }
      menu.style.display = "none";
    } else {
      // Desktop
      const hamburger = document.getElementById("hamburger-btn");
      if (hamburger) hamburger.remove();
      menu.style.display = "";
    }
  }

  checkViewport();
  window.addEventListener("resize", function () {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(checkViewport, 200);
  });
}

function setupSearchFunctionality() {
  const searchTrigger = document.getElementById("search-trigger");
  if (!searchTrigger) return;

  // Desktop: hover menu
  if (window.innerWidth > 768) {
    searchTrigger.addEventListener("mouseenter", () => {
      searchTrigger.nextElementSibling.style.display = "block";
    });
    searchTrigger.parentElement.addEventListener("mouseleave", () => {
      searchTrigger.nextElementSibling.style.display = "none";
    });
  }
  // Mobile: click menu
  else {
    searchTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      searchTrigger.nextElementSibling.classList.toggle("show");
    });
  }

  // Xử lý click option tìm kiếm
  document.querySelectorAll(".search-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const searchType = e.target.dataset.type;

      if (searchType === "person") {
        if (window.personSearchAPI) {
          window.personSearchAPI.show();
        } else {
          alert("Hệ thống tìm kiếm chưa sẵn sàng");
        }
      }

      // Đóng submenu trên mobile
      if (window.innerWidth <= 768) {
        e.target.closest(".search-submenu").classList.remove("show");
      }
    });
  });
}

function highlightActiveMenu() {
  const currentPath = window.location.pathname;
  document.querySelectorAll(".menu_item").forEach((item) => {
    const link = item.querySelector("a");
    if (link && link.getAttribute("href") === currentPath) {
      item.classList.add("active_menu_item");
    } else {
      item.classList.remove("active_menu_item");
    }
  });
}

// Mobile navigation bar
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 768) {
    const navBar = document.createElement("div");
    navBar.className = "mobile-nav-bar";
    navBar.innerHTML = `
          <a href="/languages/vn/index.html" class="mobile-nav-btn">🏠 Trang chủ</a>
          <a href="javascript:history.back()" class="mobile-nav-btn">⬅️ Quay lại</a>
          <button id="mobile-menu-btn" class="mobile-nav-btn">☰ Menu</button>
      `;
    document.body.appendChild(navBar);

    document.getElementById("mobile-menu-btn").addEventListener("click", () => {
      const menu = document.getElementById("menu_row_id");
      menu.style.display = menu.style.display === "none" ? "flex" : "none";
    });
  }
});
