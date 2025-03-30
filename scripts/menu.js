// menu.js - Tạo menu động với responsive support
document.addEventListener('DOMContentLoaded', function() {
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
        <li class="menu_item" data-tooltip="Thống kê gia tộc">
            <a href="/languages/vn/statistics.html">Thống kê</a>
        </li>
        <li class="menu_item" data-tooltip="Liên hệ quản trị viên">
            <a href="/languages/vn/contact.html">Liên hệ</a>
        </li>
        <li class="menu_item" data-tooltip="Hướng dẫn sử dụng" id="help-trigger">
            <a href="#">Trợ giúp</a>
        </li>
        <li class="menu_item search_item" data-tooltip="Tìm kiếm nhân vật">
            <input type="text" id="search_input" placeholder="Tìm kiếm Nhân vật...">
            <div class="search-dropdown"></div>
        </li>
        <li class="menu_item" data-tooltip="Quay lại trang trước">
            <button id="back_button" onclick="window.history.back();">⬅ Back</button>
        </li>
    </ul>
    `;

    // Chèn menu vào container
    const menuContainer = document.getElementById('menu_id');
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
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            // Sử dụng đường dẫn tuyệt đối từ root
            link.href = '/css/mobile.css';
            document.head.appendChild(link);
            mobileCSSLoaded = true;
            
            // Kiểm tra lỗi load CSS
            link.onerror = () => {
                console.error('Failed to load mobile.css');
                // Fallback nếu cần
                const fallbackStyle = document.createElement('style');
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
        const menu = document.getElementById('menu_row_id');
        if (!menu) return;
        
        // Thêm hamburger button nếu chưa có
        if (!document.getElementById('hamburger-btn')) {
            const hamburger = document.createElement('button');
            hamburger.id = 'hamburger-btn';
            hamburger.innerHTML = '☰ Menu';
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
            
            hamburger.addEventListener('click', function() {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        // Ẩn menu ban đầu trên mobile
        menu.style.display = 'none';
    }
    
    // Khôi phục menu desktop
    function convertToDesktopMenu() {
        const menu = document.getElementById('menu_row_id');
        const hamburger = document.getElementById('hamburger-btn');
        
        if (menu) {
            menu.style.display = '';
        }
        
        if (hamburger) {
            hamburger.remove();
        }
    }
    
    // Kiểm tra ngay khi tải trang
    checkViewport();
    
    // Theo dõi thay đổi kích thước cửa sổ
    window.addEventListener('resize', function() {
        // Sử dụng debounce để tối ưu hiệu suất
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(checkViewport, 200);
    });
}

// ========================
// CÁC HÀM CŨ GIỮ NGUYÊN
// ========================
function initTooltips() {
    const style = document.createElement('style');
    style.textContent = `
        /* Search dropdown styles */
        .search-dropdown {
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
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .search-dropdown {
                position: fixed;
                left: 10px;
                right: 10px;
                top: auto !important;
                width: auto;
                max-height: 50vh;
            }
        }
    `;
    document.head.appendChild(style);
}

function setupHelpModal() {
    // Giữ nguyên như cũ
    const trigger = document.getElementById('help-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Tạo modal với cấu trúc đơn giản
        const modal = document.createElement('div');
        modal.className = 'help-modal';
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
        document.body.style.overflow = 'hidden';
        
        // Hiển thị modal với hiệu ứng mờ dần
        setTimeout(() => { modal.style.opacity = '1'; }, 10);
        
        // Xử lý đóng modal
        const closeModal = () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        modal.querySelector('.help-modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
    });
}

function highlightActiveMenu() {
    // Giữ nguyên như cũ
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu_item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPath) {
            item.classList.add('active_menu_item');
        } else {
            item.classList.remove('active_menu_item');
        }
    });
}

// Thêm vào cuối file menu.js
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-btn');
    const menu = document.getElementById('menu_row_id');
    
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            menu.classList.toggle('show');
        });
        
        // Đóng menu khi click bên ngoài
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && e.target !== hamburger) {
                hamburger.classList.remove('active');
                menu.classList.remove('show');
            }
        });
    }
});

// Thêm vào cuối file menu.js
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ thêm trên mobile
    if (window.innerWidth <= 768) {
        // Tạo thanh điều hướng
        const navBar = document.createElement('div');
        navBar.className = 'mobile-nav-bar';
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
        const menuBtn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('menu_row_id');
        const hamburger = document.getElementById('hamburger-btn');
        
        if (menuBtn && menu) {
            menuBtn.addEventListener('click', function() {
                menu.classList.toggle('show');
                if (hamburger) {
                    hamburger.classList.toggle('active');
                }
            });
        }
        
        // Đóng menu khi click bên ngoài
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && 
                e.target !== menuBtn && 
                !menuBtn.contains(e.target)) {
                menu.classList.remove('show');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
        
        // Thêm hiệu ứng active khi chạm
        const buttons = document.querySelectorAll('.mobile-nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.backgroundColor = '#3a516e';
            });
            btn.addEventListener('touchend', function() {
                this.style.backgroundColor = '';
            });
        });
    }
});