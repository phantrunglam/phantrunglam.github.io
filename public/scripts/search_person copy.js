document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search_input');
    const searchItem = document.querySelector('.search_item');
    const resultsContainer = document.querySelector('.search-dropdown');

    if (!searchInput || !resultsContainer) {
        console.error('Search elements not found!');
        return;
    }

    // Xử lý hiển thị dropdown khi focus
    searchInput.addEventListener('focus', function() {
        searchItem.classList.add('active-search');
        if (searchInput.value.trim().length >= 2) {
            resultsContainer.classList.add('show');
        }
    });

    // Xử lý ẩn dropdown khi blur
    searchInput.addEventListener('blur', function() {
        setTimeout(() => {
            searchItem.classList.remove('active-search');
            resultsContainer.classList.remove('show');
        }, 200);
    });

    // Xử lý input search
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            resultsContainer.classList.remove('show');
            resultsContainer.innerHTML = '';
            return;
        }
        
        fetchSearchResults(query);
    });

    function fetchSearchResults(query) {
        // Gọi API search thực tế của bạn ở đây
        // Đây chỉ là ví dụ giả lập
        const mockResults = [
            { name: "Nguyễn Văn A", url: "#" },
            { name: "Trần Thị B", url: "#" },
            { name: "Lê Văn C", url: "#" },
            { name: "Phạm Thị D", url: "#" }
        ];
        
        // Lọc kết quả theo cách match một phần (như cũ)
        const filteredResults = mockResults.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        
        displayResults(filteredResults, query);
    }

    function displayResults(results, query) {
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">Không tìm thấy kết quả</div>';
        } else {
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'result-item';
                
                // Thêm highlight cho phần text khớp
                const highlightedName = highlightMatch(result.name, query);
                item.innerHTML = highlightedName;
                
                item.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    window.location.href = result.url;
                });
                resultsContainer.appendChild(item);
            });
        }
        resultsContainer.classList.add('show');
    }

    // Hàm highlight từ khóa tìm kiếm (giữ nguyên như bạn muốn)
    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Hàm escape ký tự đặc biệt trong regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
});