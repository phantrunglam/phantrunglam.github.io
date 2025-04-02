// Search person //
// last changed: 2025-03-30 
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search_input");
    const searchResults = document.querySelector(".search-dropdown");
    let currentHighlightIndex = -1;
    let filteredPersons = [];

    if (!searchInput || !searchResults) return;

    // Load person data
    fetch("/scripts/person_list.json")
        .then(response => response.json())
        .then(personList => {
            // Xử lý input
            searchInput.addEventListener("input", debounce(function () {
                const query = this.value.trim();
                if (query.length < 2) {
                    searchResults.style.display = "none";
                    return;
                }
                updateResults(query, personList);
            }, 300));

            // Xử lý keyboard
            searchInput.addEventListener("keydown", handleKeyNavigation);
        })
        .catch(console.error);

    function updateResults(query, personList) {
        const queryLower = query.toLowerCase();
        filteredPersons = personList.filter(person =>
            [person.person_name, person.person_id, person.person_birthday]
                .some(field => field && field.toLowerCase().includes(queryLower))
            .slice(0, 20)); // Giới hạn kết quả

        renderResults(query);
        searchResults.style.display = filteredPersons.length ? "block" : "none";
    }

    function renderResults(query) {
        searchResults.innerHTML = filteredPersons.length ? 
            filteredPersons.map((person, index) => `
                <div class="result-item ${index === currentHighlightIndex ? 'highlight' : ''}" 
                     data-index="${index}">
                    <a href="/languages/vn/persons/Person_${person.person_id}.html">
                        ${highlightMatches(person.person_name, query)}
                        ${person.person_birthday ? `(${highlightMatches(person.person_birthday, query)})` : ''}
                    </a>
                </div>
            `).join('') : 
            '<div class="no-results">Không tìm thấy kết quả</div>';
        
        // Thêm sự kiện hover
        document.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                currentHighlightIndex = parseInt(item.dataset.index);
                updateHighlight();
            });
        });
    }

    function handleKeyNavigation(e) {
        if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
        e.preventDefault();

        if (e.key === 'Enter' && currentHighlightIndex >= 0) {
            window.location.href = `/languages/vn/persons/Person_${filteredPersons[currentHighlightIndex].person_id}.html`;
            return;
        }

        const direction = e.key === 'ArrowDown' ? 1 : -1;
        currentHighlightIndex = Math.max(-1, 
            Math.min(filteredPersons.length - 1, currentHighlightIndex + direction));
        
        updateHighlight();
    }

    function updateHighlight() {
        document.querySelectorAll('.result-item').forEach(item => {
            item.classList.toggle('highlight', 
                parseInt(item.dataset.index) === currentHighlightIndex);
        });
        
        if (currentHighlightIndex >= 0) {
            document.querySelector(`.result-item[data-index="${currentHighlightIndex}"]`)
                ?.scrollIntoView({ block: 'nearest' });
        }
    }

    // Hàm highlight
    function highlightMatches(text, query) {
        if (!text || !query) return text;
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="match-highlight">$1</span>');
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});