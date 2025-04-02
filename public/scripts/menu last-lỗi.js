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
            z-index: 1000;
        }
        .menu_item:hover::after {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(tooltipStyle);
}

function setupHelpModal() {
    const trigger = document.getElementById('help-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Tạo modal với cấu trúc tối giản
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Hướng Dẫn Sử Dụng</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body" id="help-content"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        try {
            const response = await fetch('/languages/vn/help/help.html');
            let html = await response.text();
            
            // Bước QUAN TRỌNG: Chỉ lấy nội dung trong <body>
            const bodyStart = html.indexOf('<body>') + 6;
            const bodyEnd = html.indexOf('</body>');
            const bodyContent = bodyStart > 0 && bodyEnd > 0 
                ? html.slice(bodyStart, bodyEnd) 
                : html;
            
            // Tạo DOM ảo để xử lý
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = bodyContent;
            
            // Fix đường dẫn cho tất cả các resource
            const fixResourcePaths = (element, attribute, basePath = '/languages/vn/help/') => {
                const elements = tempDiv.querySelectorAll(element);
                elements.forEach(el => {
                    const path = el.getAttribute(attribute);
                    if (path && !path.startsWith('http') && !path.startsWith('/') && !path.startsWith('data:')) {
                        el.setAttribute(attribute, basePath + path);
                    }
                });
            };

            // Xử lý tất cả các loại resource
            fixResourcePaths('img', 'src');
            fixResourcePaths('link', 'href');
            fixResourcePaths('script', 'src');
            fixResourcePaths('a', 'href');
            
            // Thêm base tag để đảm bảo các đường dẫn tương đối hoạt động đúng
            const baseTag = document.createElement('base');
            baseTag.href = '/languages/vn/help/';
            tempDiv.prepend(baseTag);
            
            // Chỉ lấy nội dung thực sự cần thiết
            const helpContent = tempDiv.querySelector('.help-content') || tempDiv;
            
            // Chèn vào modal
            const helpContainer = document.getElementById('help-content');
            helpContainer.innerHTML = ''; // Xóa nội dung cũ
            helpContainer.appendChild(helpContent);
            
            // Xử lý đóng modal
            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            modal.querySelector('.close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => e.target === modal && closeModal());
            document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

        } catch (error) {
            console.error('Error loading help:', error);
            document.getElementById('help-content').innerHTML = `
                <div class="error-message">
                    <h3>Lỗi tải tài liệu</h3>
                    <p>Không thể tải nội dung trợ giúp. Vui lòng thử lại sau.</p>
                    <p>Chi tiết lỗi: ${error.message}</p>
                </div>
            `;
        }
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