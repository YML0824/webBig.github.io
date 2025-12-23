// 搜索功能模块
class MovieSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchForm = document.getElementById('searchForm');
        this.searchSuggestions = document.getElementById('searchSuggestions');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.handleSearchFromURL();
        this.setupClearHistory();
    }

    setupEventListeners() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            this.searchInput.addEventListener('focus', () => {
                if (this.searchInput.value) {
                    this.handleSearchInput(this.searchInput.value);
                } else {
                    this.showSearchHistory();
                }
            });

            this.searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    this.searchSuggestions.style.display = 'none';
                }, 200);
            });
        }

        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const keyword = this.searchInput.value.trim();
                if (keyword) {
                    this.performSearch(keyword);
                }
            });
        }
    }

    // 处理搜索输入
    handleSearchInput(keyword) {
        if (!keyword.trim()) {
            this.showSearchHistory();
            return;
        }

        const results = this.searchMovies(keyword);
        this.displaySuggestions(results, keyword);
    }

    // 显示搜索历史
    showSearchHistory() {
        const searchHistory = this.getSearchHistory();
        if (searchHistory.length === 0) {
            this.searchSuggestions.style.display = 'none';
            return;
        }

        const historyHtml = `
            <div class="search-history">
                <div class="history-title">最近搜索</div>
                ${searchHistory.map(term => `
                    <div class="search-suggestion history-item" data-term="${term}">
                        <i class="fas fa-history"></i>
                        <div class="suggestion-info">
                            <div class="suggestion-title">${term}</div>
                        </div>
                    </div>
                `).join('')}
                ${searchHistory.length > 0 ? '<div class="clear-history" id="clearHistory">清除历史记录</div>' : ''}
            </div>
        `;

        this.searchSuggestions.innerHTML = historyHtml;
        this.searchSuggestions.style.display = 'block';

        this.setupHistoryItems();
    }

    // 搜索电影
    searchMovies(keyword) {
        const searchTerm = keyword.toLowerCase().trim();
        if (!searchTerm) return [];

        return window.movies.filter(movie => {
            const searchFields = [
                movie.title,
                movie.director,
                ...movie.genre,
                movie.description,
                movie.cast.join(' '),
                movie.country,
                movie.year.toString()
            ];

            return searchFields.some(field => 
                field.toLowerCase().includes(searchTerm)
            );
        }).sort((a, b) => {
            // 优先排序：标题匹配 > 导演匹配 > 类型匹配 > 其他
            const aTitle = a.title.toLowerCase().includes(searchTerm);
            const bTitle = b.title.toLowerCase().includes(searchTerm);
            if (aTitle && !bTitle) return -1;
            if (!aTitle && bTitle) return 1;
            
            const aDirector = a.director.toLowerCase().includes(searchTerm);
            const bDirector = b.director.toLowerCase().includes(searchTerm);
            if (aDirector && !bDirector) return -1;
            if (!aDirector && bDirector) return 1;
            
            // 最后按评分排序
            return b.rating - a.rating;
        });
    }

    // 显示搜索建议
    displaySuggestions(results, keyword) {
        if (results.length === 0) {
            this.searchSuggestions.innerHTML = `
                <div class="search-suggestion no-result">
                    <i class="fas fa-search"></i>
                    <div class="suggestion-info">
                        <div class="suggestion-title">没有找到相关电影</div>
                        <div class="suggestion-meta">试试其他关键词</div>
                    </div>
                </div>
            `;
            this.searchSuggestions.style.display = 'block';
            return;
        }

        const suggestionsHtml = results.slice(0, 8).map(movie => `
            <div class="search-suggestion" data-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="suggestion-poster">
                <div class="suggestion-info">
                    <div class="suggestion-title">${this.highlightText(movie.title, keyword)}</div>
                    <div class="suggestion-meta">
                        <span><i class="fas fa-calendar"></i> ${movie.year}</span>
                        <span><i class="fas fa-film"></i> ${movie.genre.slice(0, 2).join(' / ')}</span>
                        <span class="rating"><i class="fas fa-star"></i> ${movie.rating}</span>
                    </div>
                    <div class="suggestion-director">
                        <i class="fas fa-user-tie"></i> ${this.highlightText(movie.director, keyword)}
                    </div>
                </div>
            </div>
        `).join('');

        const showAllHtml = results.length > 8 ? `
            <div class="search-suggestion show-all" data-keyword="${keyword}">
                <i class="fas fa-search-plus"></i>
                <div class="suggestion-info">
                    <div class="suggestion-title">查看全部 ${results.length} 个结果</div>
                </div>
            </div>
        ` : '';

        this.searchSuggestions.innerHTML = suggestionsHtml + showAllHtml;
        this.searchSuggestions.style.display = 'block';

        this.setupSuggestionItems();
    }

    // 执行搜索
    performSearch(keyword) {
        if (!keyword.trim()) return;

        this.saveSearchHistory(keyword);

        if (window.location.pathname.includes('search-results.html')) {
            // 当前已在搜索结果页，直接更新结果
            window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
        } else {
            window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
        }
    }

    // 处理URL中的搜索参数
    handleSearchFromURL() {
        if (window.location.pathname.includes('search-results.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('q');
            
            if (searchQuery) {
                document.getElementById('searchKeyword').textContent = searchQuery;
                
                if (this.searchInput) {
                    this.searchInput.value = searchQuery;
                }
                
                this.displaySearchResults(searchQuery);
            }
        }
    }

    // 显示搜索结果
    displaySearchResults(keyword) {
        const results = this.searchMovies(keyword);
        const resultsContainer = document.getElementById('searchResults');
        const noResultsElement = document.getElementById('noResults');
        const resultCountElement = document.getElementById('resultCount');

        if (resultCountElement) {
            resultCountElement.textContent = results.length;
        }

        if (results.length === 0) {
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (noResultsElement) noResultsElement.style.display = 'block';
        } else {
            if (resultsContainer) resultsContainer.style.display = 'grid';
            if (noResultsElement) noResultsElement.style.display = 'none';
            
            if (resultsContainer) {
                resultsContainer.innerHTML = results.map(movie => `
                    <div class="movie-card" data-id="${movie.id}">
                        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                        <div class="movie-info">
                            <h3 class="movie-title">${this.highlightText(movie.title, keyword)}</h3>
                            <div class="movie-meta">
                                <span>${movie.year}</span>
                                <span class="movie-rating">⭐ ${movie.rating}</span>
                            </div>
                            <p class="movie-desc">${this.highlightText(this.truncateText(movie.description, 100), keyword)}</p>
                            <div class="movie-tags">
                                ${movie.genre.map(genre => `<span class="tag">${genre}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');

                resultsContainer.querySelectorAll('.movie-card').forEach(card => {
                    card.addEventListener('click', (e) => {
                        const movieId = e.currentTarget.dataset.id;
                        window.location.href = `movie-detail.html?id=${movieId}`;
                    });
                });
            }
        }
    }

    // 高亮显示搜索关键词
    highlightText(text, keyword) {
        if (!keyword || !text) return text;
        
        const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // 截断文本
    truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // 保存搜索历史
    saveSearchHistory(keyword) {
        let searchHistory = JSON.parse(localStorage.getItem('movieSearchHistory') || '[]');
        
        searchHistory = searchHistory.filter(item => item !== keyword);
        searchHistory.unshift(keyword);
        searchHistory = searchHistory.slice(0, 10);
        
        localStorage.setItem('movieSearchHistory', JSON.stringify(searchHistory));
    }

    // 获取搜索历史
    getSearchHistory() {
        return JSON.parse(localStorage.getItem('movieSearchHistory') || '[]');
    }

    // 设置建议项点击事件
    setupSuggestionItems() {
        this.searchSuggestions.querySelectorAll('.search-suggestion').forEach(item => {
            if (item.classList.contains('show-all')) {
                item.addEventListener('click', (e) => {
                    const keyword = e.currentTarget.dataset.keyword;
                    if (keyword) {
                        this.performSearch(keyword);
                    }
                });
            } else if (item.dataset.id) {
                item.addEventListener('click', (e) => {
                    const movieId = e.currentTarget.dataset.id;
                    window.location.href = `movie-detail.html?id=${movieId}`;
                });
            }
        });
    }

    // 设置历史项点击事件
    setupHistoryItems() {
        this.searchSuggestions.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const searchTerm = e.currentTarget.dataset.term;
                this.searchInput.value = searchTerm;
                this.performSearch(searchTerm);
            });
        });
    }

    // 设置清除历史记录
    setupClearHistory() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clearHistory') {
                localStorage.removeItem('movieSearchHistory');
                this.searchSuggestions.style.display = 'none';
            }
        });
    }
}

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', function() {
    const search = new MovieSearch();
    
    // 如果是搜索结果页面，添加高亮样式
    if (window.location.pathname.includes('search-results.html')) {
        const style = document.createElement('style');
        style.textContent = `
            .highlight {
                background-color: #fffacd;
                padding: 2px 4px;
                border-radius: 2px;
                color: #ff4757;
                font-weight: bold;
            }
            
            .search-history {
                padding: 10px 0;
            }
            
            .history-title {
                padding: 8px 16px;
                font-size: 0.9rem;
                color: #666;
                border-bottom: 1px solid #eee;
                margin-bottom: 5px;
            }
            
            .clear-history {
                padding: 10px 16px;
                text-align: center;
                color: #ff4757;
                cursor: pointer;
                font-size: 0.9rem;
                border-top: 1px solid #eee;
            }
            
            .clear-history:hover {
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(style);
    }
});