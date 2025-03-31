// menu.js - Tạo menu động với responsive support
document.addEventListener("DOMContentLoaded", function () {
  // Tạo menu HTML (giữ nguyên)
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

    <div class="search-container" style="display:none;">
        <input type="text" id="search_input" placeholder="Tìm kiếm thành viên...">
        <div class="search-dropdown"></div>
    </div>
    `;

  // Chèn menu vào container
  const menuContainer = document.getElementById("menu_id");
  if (menuContainer) {
    menuContainer.innerHTML = menuHTML;

    // Khởi tạo tooltips
    initTooltips();

    // Thiết lập modal help
    setupHelpModal();

    // Thêm responsive support
    setupResponsiveMenu();
  }

  // Khôi phục trạng thái active menu
  highlightActiveMenu();
});

// ========================
// RESPONSIVE MENU SUPPORT
// ========================
function setupResponsiveMenu() {
  const mobileBreakpoint = 768;
  let mobileCSSLoaded = false;

  // Kiểm tra kích thước màn hình
  function checkViewport() {
    const isMobile = window.innerWidth <= mobileBreakpoint;

    if (isMobile) {
      loadMobileCSS();
      convertToMobileMenu();
    } else {
      convertToDesktopMenu();
    }
  }

  // Load mobile.css khi cần
  function loadMobileCSS() {
    if (!mobileCSSLoaded) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      // Sử dụng đường dẫn tuyệt đối từ root
      link.href = "/css/mobile.css";
      document.head.appendChild(link);
      mobileCSSLoaded = true;

      // Kiểm tra lỗi load CSS
      link.onerror = () => {
        console.error("Failed to load mobile.css");
        // Fallback nếu cần
        const fallbackStyle = document.createElement("style");
        fallbackStyle.textContent = `
                    /* Mobile fallback styles */
                    @media (max-width: 768px) {
                        #menu_row_id {
                            flex-direction: column;
                        }
                    }
                `;
        document.head.appendChild(fallbackStyle);
      };
    }
  }

  // Chuyển đổi sang menu mobile
  function convertToMobileMenu() {
    const menu = document.getElementById("menu_row_id");
    if (!menu) return;

    // Thêm hamburger button nếu chưa có
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

      hamburger.addEventListener("click", function () {
        menu.style.display = menu.style.display === "none" ? "block" : "none";
      });
    }

    // Ẩn menu ban đầu trên mobile
    menu.style.display = "none";
  }

  // Khôi phục menu desktop
  function convertToDesktopMenu() {
    const menu = document.getElementById("menu_row_id");
    const hamburger = document.getElementById("hamburger-btn");

    if (menu) {
      menu.style.display = "";
    }

    if (hamburger) {
      hamburger.remove();
    }
  }

  // Kiểm tra ngay khi tải trang
  checkViewport();

  // Theo dõi thay đổi kích thước cửa sổ
  window.addEventListener("resize", function () {
    // Sử dụng debounce để tối ưu hiệu suất
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(checkViewport, 200);
  });
}

// ========================
// CÁC HÀM CŨ GIỮ NGUYÊN
// ========================
/// 2025-03-30 new initTooltips with subMenu
function initTooltips() {
  const style = document.createElement("style");
  style.textContent = `
    /* ========== TOOLTIP STYLES FOR ALL MENU ITEMS ========== */
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
        
        /* Ẩn tooltip trên mobile */
        @media (max-width: 768px) {
            .menu_item::after {
                display: none;
            }
        }

        /* Hide tooltip when submenu is active */
        .menu_item:focus-within::after,
        .search-submenu.show ~ .menu_item::after {
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* ========== SEARCH SUBMENU STYLES ========== */
        .search-submenu {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 60vh;
            overflow-y: auto;
            width: 100%;
            z-index: 1000;
        }
        
        /* Desktop/Tablet behavior */
        @media (min-width: 769px) {
            .search-submenu {
                position: absolute;
                top: 100%;
                left: 0;
                min-width: 220px;
                display: none;
            }
            
            .search-parent-item:hover .search-submenu {
                display: block;
            }
        }
        
        /* Mobile behavior */
        @media (max-width: 768px) {
            .search-submenu {
                position: static;
                border: none;
                box-shadow: none;
                max-height: none;
                display: none;
            }
            
            .search-submenu.show {
                display: block;
            }
        }
        
        .search-option {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            transition: all 0.2s;
            display: block;
            color: #333;
            text-decoration: none;
        }
        
        .search-option:hover, 
        .search-option:focus {
            background: #f5f8fa !important;
        }
        
        /* ========== SEARCH RESULTS STYLES ========== */
        .search-results-container {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-height: 60vh;
            overflow-y: auto;
            width: 100%;
            z-index: 1000;
        }
        
        .result-item {
            padding: 10px 15px;
            border-bottom: 1px solid #eee;
            transition: all 0.2s;
        }
        
        .result-item:hover, 
        .result-item.highlight {
            background: #f5f8fa !important;
        }
        
        .result-item a {
            color: #333;
            text-decoration: none;
            display: block;
        }
        
        .match-highlight {
            background-color: #ffeb3b;
            font-weight: bold;
            padding: 0 2px;
            border-radius: 2px;
        }
        
        .no-results {
            color: #666;
            padding: 10px;
            text-align: center;
        }
        
        /* ========== TOOLTIP ADJUSTMENTS ========== */
        .search-parent-item {
            position: relative;
        }
        
        .search-parent-item::after {
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
        
        .search-parent-item:hover::after {
            opacity: 1;
            visibility: visible;
        }
        
        /* Hide tooltip when submenu is active */
        .search-parent-item:focus-within::after,
        .search-submenu.show ~ .search-parent-item::after {
            opacity: 0 !important;
            visibility: hidden !important;
        }
        
        /* ========== MOBILE RESPONSIVE ========== */
        @media (max-width: 768px) {
            .search-results-container {
                position: fixed;
                left: 10px;
                right: 10px;
                top: auto !important;
                width: auto;
                max-height: 50vh;
            }
            
            .search-parent-item::after {
                display: none;
            }
        }
    `;
  document.head.appendChild(style);

  // thêm xử lý 2025-03-30
  // Thêm vào cuối hàm initTooltips()
  const menuItems = document.querySelectorAll(".menu_item");
  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      // Xử lý thêm nếu cần
    });
    item.addEventListener("mouseleave", () => {
      // Xử lý thêm nếu cần
    });
  });
}

function setupHelpModal() {
  // Giữ nguyên như cũ
  const trigger = document.getElementById("help-trigger");
  if (!trigger) return;

  trigger.addEventListener("click", async function (e) {
    e.preventDefault();

    // Tạo modal với cấu trúc đơn giản
    const modal = document.createElement("div");
    modal.className = "help-modal";
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
            opacity: 0;
            transition: opacity 0.3s;
        `;

    modal.innerHTML = `
            <div class="help-modal-content" style="
                background: white;
                width: 80%;
                max-width: 900px;
                height: 80vh;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div class="help-modal-header" style="
                    padding: 15px;
                    background: #2c3e50;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0;">Hướng Dẫn Sử Dụng</h2>
                    <span class="help-modal-close" style="
                        font-size: 24px;
                        cursor: pointer;
                    ">&times;</span>
                </div>
                <iframe 
                    id="help-iframe" 
                    src="/languages/vn/help/help.html" 
                    style="
                        flex: 1;
                        width: 100%;
                        border: none;
                    "
                    loading="lazy"
                ></iframe>
            </div>
        `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Hiển thị modal với hiệu ứng mờ dần
    setTimeout(() => {
      modal.style.opacity = "1";
    }, 10);

    // Xử lý đóng modal
    const closeModal = () => {
      modal.style.opacity = "0";
      setTimeout(() => {
        modal.remove();
        document.body.style.overflow = "";
      }, 300);
    };

    modal
      .querySelector(".help-modal-close")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => e.target === modal && closeModal());
    document.addEventListener(
      "keydown",
      (e) => e.key === "Escape" && closeModal()
    );
  });
}

function highlightActiveMenu() {
  // Giữ nguyên như cũ
  const currentPath = window.location.pathname;
  const menuItems = document.querySelectorAll(".menu_item");

  menuItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link && link.getAttribute("href") === currentPath) {
      item.classList.add("active_menu_item");
    } else {
      item.classList.remove("active_menu_item");
    }
  });
}

// Thêm vào cuối file menu.js
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-btn");
  const menu = document.getElementById("menu_row_id");

  if (hamburger && menu) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      menu.classList.toggle("show");
    });

    // Đóng menu khi click bên ngoài
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target) && e.target !== hamburger) {
        hamburger.classList.remove("active");
        menu.classList.remove("show");
      }
    });
  }
});

// Thêm vào cuối file menu.js
document.addEventListener("DOMContentLoaded", function () {
  // Chỉ thêm trên mobile
  if (window.innerWidth <= 768) {
    // Tạo thanh điều hướng
    const navBar = document.createElement("div");
    navBar.className = "mobile-nav-bar";
    navBar.innerHTML = `
            <a href="/languages/vn/index.html" class="mobile-nav-btn" title="Trang chủ">
                <span class="mobile-nav-icon">🏠</span>
                <span>Trang chủ</span>
            </a>
            <a href="javascript:history.back()" class="mobile-nav-btn" title="Quay lại">
                <span class="mobile-nav-icon">⬅️</span>
                <span>Quay lại</span>
            </a>
            <button class="mobile-nav-btn" id="mobile-menu-btn" title="Menu">
                <span class="mobile-nav-icon">☰</span>
                <span>Menu</span>
            </button>
        `;
    document.body.appendChild(navBar);

    // Kết nối nút menu với menu hiện có
    const menuBtn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("menu_row_id");
    const hamburger = document.getElementById("hamburger-btn");

    if (menuBtn && menu) {
      menuBtn.addEventListener("click", function () {
        menu.classList.toggle("show");
        if (hamburger) {
          hamburger.classList.toggle("active");
        }
      });
    }

    // Đóng menu khi click bên ngoài
    document.addEventListener("click", function (e) {
      if (
        !menu.contains(e.target) &&
        e.target !== menuBtn &&
        !menuBtn.contains(e.target)
      ) {
        menu.classList.remove("show");
        if (hamburger) hamburger.classList.remove("active");
      }
    });

    // Thêm hiệu ứng active khi chạm
    const buttons = document.querySelectorAll(".mobile-nav-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("touchstart", function () {
        this.style.backgroundColor = "#3a516e";
      });
      btn.addEventListener("touchend", function () {
        this.style.backgroundColor = "";
      });
    });
  }
});

// Xử lý search submenu
// Xử lý submenu đa nền tảng
document.addEventListener("DOMContentLoaded", function () {
  const searchTrigger = document.getElementById("search-trigger");

  if (searchTrigger) {
    // Desktop/Tablet: hover để hiện submenu
    if (window.innerWidth > 768) {
      searchTrigger.addEventListener("mouseenter", function () {
        this.nextElementSibling.style.display = "block";
      });

      searchTrigger.parentElement.addEventListener("mouseleave", function () {
        this.querySelector(".search-submenu").style.display = "none";
      });
    }
    // Mobile: click để toggle
    else {
      searchTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("show");
      });
    }

    // Xử lý chọn option tìm kiếm
    document.querySelectorAll(".search-option").forEach((option) => {
      option.addEventListener("click", function (e) {
        e.preventDefault();
        const searchType = this.dataset.type;
        showSearchDialog(searchType);

        // Đóng submenu trên mobile
        if (window.innerWidth <= 768) {
          this.closest(".search-submenu").classList.remove("show");
        }
      });
    });
  }
});

// Kiểm tra khi thay đổi kích thước màn hình
window.addEventListener("resize", function () {
  const searchSubmenus = document.querySelectorAll(".search-submenu");
  const isMobile = window.innerWidth <= 768;

  searchSubmenus.forEach((menu) => {
    if (isMobile) {
      menu.style.display = "";
      menu.classList.remove("show");
    } else {
      menu.classList.remove("show");
      menu.style.display = "none";
    }
  });
});

// 2025-03-30 17:50 thêm code cho subMenu - search Person
// Thêm vào cuối file menu.js
function showSearchDialog(searchType) {
  if (searchType === "person") {
    showPersonSearchDialog();
  } else if (searchType === "birthday") {
    showBirthdaySearchDialog();
  } else if (searchType === "anniversary") {
    showAnniversarySearchDialog();
  } else if (searchType === "report") {
    showReportDialog();
  }
}

/* function showPersonSearchDialog() {
  // 1. Kiểm tra search_person.js đã sẵn sàng chưa
  const existingSearchInput = document.getElementById("search_input");
  const existingResults = document.querySelector(".search-dropdown");

  if (existingSearchInput && existingResults) {
    // Kích hoạt tìm kiếm hiện có
    existingSearchInput.style.display = "block";
    existingSearchInput.focus();
    existingResults.style.display = "block";
    return;
  }

  // Tạo modal tìm kiếm
  const modal = document.createElement("div");
  modal.className = "search-modal";
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
        align-items: flex-start;
        padding-top: 50px;
        opacity: 0;
        transition: opacity 0.3s;
    `;

  modal.innerHTML = `
        <div class="search-modal-content" style="
            background: white;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        ">
            <div class="search-modal-header" style="
                padding: 15px;
                background: #2c3e50;
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <h3 style="margin: 0;">Tìm kiếm thành viên</h3>
                <span class="search-modal-close" style="
                    font-size: 24px;
                    cursor: pointer;
                ">&times;</span>
            </div>
            <div class="search-modal-body" style="padding: 20px; overflow-y: auto;">
                <div class="search-input-container" style="margin-bottom: 20px;">
                    <input type="text" id="person-search-input" 
                        placeholder="Nhập tên, biệt danh hoặc ID..." 
                        style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"
                        autofocus>
                </div>
                <div id="search-results" style="max-height: 50vh; overflow-y: auto;">
                    <!-- Kết quả tìm kiếm sẽ hiển thị ở đây -->
                    <div class="no-results" style="text-align: center; color: #666; padding: 20px;">
                        Nhập từ khóa để tìm kiếm thành viên
                    </div>
                </div>
            </div>
            <div class="search-modal-footer" style="
                padding: 15px;
                background: #f5f5f5;
                display: flex;
                justify-content: flex-end;
                border-top: 1px solid #ddd;
            ">
                <button id="cancel-search" style="
                    padding: 8px 15px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 10px;
                ">Đóng</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  // 3. Thêm xử lý tìm kiếm fallback
  const searchInput = modal.querySelector("#fallback-search-input");
  searchInput.addEventListener(
    "input",
    debounce(() => {
      // Sử dụng API từ search_person.js nếu có
      if (window.personSearchAPI) {
        window.personSearchAPI
          .search(searchInput.value)
          .then((results) => displayFallbackResults(results));
      } else {
        // Fallback tìm kiếm đơn giản
        fetch("/scripts/person_list.json")
          .then((response) => response.json())
          .then((persons) => {
            const filtered = persons.filter((p) =>
              p.person_name
                .toLowerCase()
                .includes(searchInput.value.toLowerCase())
            );
            displayFallbackResults(filtered);
          });
      }
    }, 300)
  );

  // Hiển thị modal với hiệu ứng
  setTimeout(() => {
    modal.style.opacity = "1";
  }, 10);

  // Xử lý đóng modal
  const closeModal = () => {
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  };

  modal
    .querySelector(".search-modal-close")
    .addEventListener("click", closeModal);
  modal.querySelector("#cancel-search").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && closeModal()
  );

  // Xử lý tìm kiếm
  searchInput = modal.querySelector("#person-search-input");
  const searchResults = modal.querySelector("#search-results");

  searchInput.addEventListener(
    "input",
    debounce(() => {
      const query = searchInput.value.trim();

      if (query.length === 0) {
        searchResults.innerHTML = `
                <div class="no-results" style="text-align: center; color: #666; padding: 20px;">
                    Nhập từ khóa để tìm kiếm thành viên
                </div>
            `;
        return;
      }

      // Hiển thị trạng thái loading
      searchResults.innerHTML = `
            <div class="loading" style="text-align: center; padding: 20px;">
                <div class="spinner" style="
                    width: 40px;
                    height: 40px;
                    margin: 0 auto;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <p>Đang tìm kiếm...</p>
            </div>
        `;

      // Gọi API tìm kiếm (thay thế bằng API thực tế của bạn)
      searchPersons(query)
        .then((persons) => displaySearchResults(persons, query))
        .catch((error) => {
          console.error("Search error:", error);
          searchResults.innerHTML = `
                    <div class="error" style="text-align: center; color: #e74c3c; padding: 20px;">
                        Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.
                    </div>
                `;
        });
    }, 300)
  );

  // Cho phép tìm kiếm bằng phím Enter
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query.length > 0) {
        searchInput.dispatchEvent(new Event("input"));
      }
    }
  });
} */

function showPersonSearchDialog() {
  // Đảm bảo search_person.js đã load xong
  if (!window.personSearchAPI) {
    console.error("Search API not loaded");
    return;
  }

  // Tạo modal container nếu chưa có
  let modal = document.querySelector(".search-modal-container");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "search-modal-container";
    modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.7);
          z-index: 9999;
          display: flex;
          justify-content: center;
          padding-top: 50px;
      `;
    document.body.appendChild(modal);
  }

  // Tạo nội dung modal
  modal.innerHTML = `
  <div style="background: white; width: 90%; max-width: 600px; 
              border-radius: 8px; padding: 20px; position: relative;">
      <h3 style="margin-top: 0;">Tìm kiếm thành viên</h3>
      <div id="embedded-search-area" style="margin: 15px 0;"></div>
      <button onclick="document.querySelector('.search-modal-container').remove()" 
              style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px;">
          ×
      </button>
  </div>
`;

  // Di chuyển search container vào modal
  const searchContainer = document.querySelector(".global-search-container");
  const embedArea = document.getElementById("embedded-search-area");

  if (searchContainer && embedArea) {
    // Reset style cho search container
    searchContainer.style.position = "static";
    searchContainer.style.transform = "none";
    searchContainer.style.width = "100%";
    searchContainer.style.maxWidth = "100%";
    searchContainer.style.margin = "0";

    embedArea.appendChild(searchContainer);

    // Kích hoạt tìm kiếm
    window.personSearchAPI.activate();

    // Focus vào ô input sau 100ms để đảm bảo DOM đã sẵn sàng
    setTimeout(() => {
      const input = searchContainer.querySelector("input");
      if (input) input.focus();
    }, 100);
  } else {
    console.error("Cannot find search elements");
  }
}

// Hàm debounce để tối ưu hiệu suất tìm kiếm
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

/* // Hàm giả lập API tìm kiếm (thay bằng API thực tế của bạn)
function searchPersons(query) {
  return new Promise((resolve) => {
    // Giả lập delay API
    setTimeout(() => {
      // Đây là dữ liệu giả, thay bằng API thực tế
      const mockData = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          birthYear: 1980,
          deathYear: null,
          family: "Nguyễn Văn",
        },
        {
          id: 2,
          name: "Trần Thị B",
          birthYear: 1985,
          deathYear: null,
          family: "Trần Thị",
        },
        {
          id: 3,
          name: "Lê Văn C",
          birthYear: 1975,
          deathYear: 2020,
          family: "Lê Văn",
        },
        {
          id: 4,
          name: "Phạm Thị D",
          birthYear: 1990,
          deathYear: null,
          family: "Phạm Thị",
        },
        {
          id: 5,
          name: "Hoàng Văn E",
          birthYear: 1965,
          deathYear: 2021,
          family: "Hoàng Văn",
        },
      ];

      // Lọc kết quả giả dựa trên query
      const results = mockData.filter(
        (person) =>
          person.name.toLowerCase().includes(query.toLowerCase()) ||
          person.family.toLowerCase().includes(query.toLowerCase())
      );

      resolve(results);
    }, 500);
  });
}
 */

// Hiển thị kết quả tìm kiếm
function displaySearchResults(persons, query) {
  const searchResults = document.querySelector("#search-results");

  if (persons.length === 0) {
    searchResults.innerHTML = `
            <div class="no-results" style="text-align: center; color: #666; padding: 20px;">
                Không tìm thấy kết quả phù hợp với "${query}"
            </div>
        `;
    return;
  }

  let html = '<div class="search-results-list">';

  persons.forEach((person) => {
    // Highlight từ khóa tìm kiếm trong tên
    const highlightedName = highlightMatches(person.name, query);
    const highlightedFamily = highlightMatches(person.family, query);

    html += `
            <div class="result-item" style="
                padding: 12px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background-color 0.2s;
            " data-id="${person.id}" onclick="viewPersonDetail(${person.id})">
                <div style="font-weight: bold; margin-bottom: 5px;">${highlightedName}</div>
                <div style="color: #666; font-size: 0.9em;">
                    <span>Họ tộc: ${highlightedFamily}</span> | 
                    <span>Sinh năm: ${person.birthYear || "Chưa rõ"}</span>
                    ${
                      person.deathYear
                        ? ` | <span>Mất năm: ${person.deathYear}</span>`
                        : ""
                    }
                </div>
            </div>
        `;
  });

  html += "</div>";
  searchResults.innerHTML = html;
}

// Hàm highlight từ khóa tìm kiếm
function highlightMatches(text, query) {
  if (!query) return text;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.replace(regex, '<span class="match-highlight">$1</span>');
}

// Escape ký tự đặc biệt trong regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Hàm xem chi tiết người (thay bằng hàm thực tế của bạn)
function viewPersonDetail(personId) {
  // Đóng modal tìm kiếm
  document.querySelector(".search-modal")?.remove();
  document.body.style.overflow = "";

  // Chuyển hướng đến trang chi tiết (thay bằng URL thực tế)
  window.location.href = `/languages/vn/person.html?id=${personId}`;

  // Hoặc có thể mở modal chi tiết nếu bạn muốn
  // showPersonDetailModal(personId);
}
