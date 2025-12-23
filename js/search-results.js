// 搜索结果页面逻辑
class SearchResults {
    constructor() {
        this.searchKeyword = '';
        this.currentFilter = 'all';
        this.relatedKeywords = [
            '科幻', '喜剧', '动作', '爱情', '悬疑', 
            '动画', '2023', '张艺谋', '郭帆', '吴京'
        ];
        
        this.init();
    }

    init() {
        this.getSearchKeyword();
        this.setupEventListeners();
        this.loadRelatedSearches();
        this.setupFilterButtons();
    }

    getSearchKeyword() {
        const urlParams = new URLSearchParams(window.location.search);
        this.searchKeyword = urlParams.get('q') || '';
        
        // 更新页面显示
        const keywordElement = document.getElementById('searchKeyword');
        const countElement = document.getElementById('resultCount');
        
        if (keywordElement) {
            keywordElement.textContent = this.searchKeyword;
        }
        
        // 如果搜索框存在，填充关键词
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = this.searchKeyword;
        }
        
        // 更新页面标题
        document.title = `"${this.searchKeyword}" 的搜索结果 - 我的电影`;
        
        // 显示搜索结果数量（在Search.js中处理）
    }

    setupEventListeners() {
        // 筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 重新筛选结果（需要与Search.js配合）
        this.filterResults();
    }

    filterResults() {
        // 这个功能需要与Search.js的搜索结果配合
        // 这里主要是演示筛选逻辑
        console.log('当前筛选条件:', this.currentFilter);
    }

    loadRelatedSearches() {
        if (!this.searchKeyword) return;
        
        const relatedTags = document.querySelector('.related-tags');
        if (!relatedTags) return;
        
        // 根据搜索关键词生成相关搜索
        let relatedKeywords = [];
        
        if (this.searchKeyword.includes('电')) {
            relatedKeywords = ['电影', '电视剧', '影院', '观影'];
        } else if (this.searchKeyword.includes('爱')) {
            relatedKeywords = ['爱情', '恋爱', '浪漫', '情侣'];
        } else if (this.searchKeyword.includes('科')) {
            relatedKeywords = ['科幻', '科技', '未来', '太空'];
        } else {
            // 随机选择一些相关关键词
            relatedKeywords = this.relatedKeywords
                .filter(keyword => keyword !== this.searchKeyword)
                .sort(() => Math.random() - 0.5)
                .slice(0, 6);
        }
        
        // 渲染相关搜索标签
        relatedTags.innerHTML = relatedKeywords.map(keyword => `
            <a href="search-results.html?q=${encodeURIComponent(keyword)}" class="tag">${keyword}</a>
        `).join('');
    }

    setupFilterButtons() {
        // 为热门搜索标签添加点击事件
        document.querySelectorAll('.popular-tags a').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                const keyword = e.target.textContent;
                window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
            });
        });
    }

    // 获取搜索分类结果
    getSearchResultsByCategory(keyword) {
        if (!keyword) return {};
        
        const allMovies = window.movies || [];
        
        return {
            movie: allMovies.filter(movie => 
                movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
                movie.description.toLowerCase().includes(keyword.toLowerCase())
            ),
            director: allMovies.filter(movie => 
                movie.director.toLowerCase().includes(keyword.toLowerCase())
            ),
            genre: allMovies.filter(movie => 
                movie.genre.some(g => g.toLowerCase().includes(keyword.toLowerCase()))
            ),
            all: allMovies.filter(movie => 
                movie.title.toLowerCase().includes(keyword.toLowerCase()) ||
                movie.director.toLowerCase().includes(keyword.toLowerCase()) ||
                movie.genre.some(g => g.toLowerCase().includes(keyword.toLowerCase())) ||
                movie.description.toLowerCase().includes(keyword.toLowerCase()) ||
                movie.cast.some(actor => actor.toLowerCase().includes(keyword.toLowerCase()))
            )
        };
    }
}

// 扩展Search类以支持搜索结果页
if (window.MovieSearch) {
    MovieSearch.prototype.displaySearchResults = function(keyword) {
        const results = this.searchMovies(keyword);
        const resultsContainer = document.getElementById('searchResults');
        const noResultsElement = document.getElementById('noResults');
        const resultCountElement = document.getElementById('resultCount');
        const relatedSearches = document.querySelector('.related-searches');

        if (resultCountElement) {
            resultCountElement.textContent = results.length;
        }

        if (results.length === 0) {
            if (resultsContainer) resultsContainer.style.display = 'none';
            if (noResultsElement) noResultsElement.style.display = 'block';
            if (relatedSearches) relatedSearches.style.display = 'none';
        } else {
            if (resultsContainer) resultsContainer.style.display = 'grid';
            if (noResultsElement) noResultsElement.style.display = 'none';
            if (relatedSearches) relatedSearches.style.display = 'block';
            
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
    };
}

// 初始化搜索结果页
document.addEventListener('DOMContentLoaded', function() {
    new SearchResults();
    
    // 确保Search.js已初始化
    if (window.MovieSearch) {
        new MovieSearch();
    }
    
    // 添加搜索结果页的CSS
    const style = document.createElement('style');
    style.textContent = `
        .search-filter {
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        
        .filter-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 0.5rem 1rem;
            border: 1px solid #ddd;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        .filter-btn:hover {
            border-color: #ff4757;
            color: #ff4757;
        }
        
        .filter-btn.active {
            background: #ff4757;
            color: white;
            border-color: #ff4757;
        }
        
        .related-searches {
            margin: 2rem 0;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .related-searches h3 {
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
        }
        
        .related-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .related-tags .tag {
            background: #f8f9fa;
            color: #495057;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s;
        }
        
        .related-tags .tag:hover {
            background: #ff4757;
            color: white;
        }
        
        .popular-searches {
            margin: 2rem 0;
            padding: 1.5rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .popular-searches h3 {
            margin-bottom: 1rem;
            color: #333;
            font-size: 1.2rem;
        }
        
        .popular-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .popular-tags .tag {
            background: linear-gradient(135deg, #ff4757, #ff6b81);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            text-decoration: none;
            font-size: 0.9rem;
            transition: transform 0.3s;
        }
        
        .popular-tags .tag:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        }
    `;
    document.head.appendChild(style);
});