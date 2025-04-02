// menu.js - Tạo menu động với tooltips và modal help
document.addEventListener('DOMContentLoaded', function() {
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
    }

    // Khôi phục trạng thái active menu
    highlightActiveMenu();
});

function initTooltips() {
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        /* Tooltip cho các menu item thông thường */
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

        /* Tắt tooltip khi search active */
        .search_item.active-search::after {
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* Dropdown styles */
        .search-dropdown {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: none;
            z-index: 1000;
        }
        .search-dropdown.show {
            display: block;
        }
        .result-item {
            padding: 8px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }
        .result-item:hover {
            background-color: #f5f5f5;
        }
        .no-results {
            padding: 8px;
            color: #666;
            font-style: italic;
        }
    `;
    document.head.appendChild(tooltipStyle);
}

function setupHelpModal() {
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