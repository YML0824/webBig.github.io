// 电影列表页逻辑
class MovieList {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentFilter = {
            genre: '',
            year: '',
            rating: '',
            sort: 'rating_desc'
        };
        this.totalResults = 0;
        
        this.init();
    }

    init() {
        // 等待movies数据加载
        if (!window.movies || !Array.isArray(window.movies)) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.setupEventListeners();
        this.loadMovies();
        this.setupPagination();
        this.updateResultCount();
    }

    setupEventListeners() {
        // 筛选按钮
        document.getElementById('applyFilter')?.addEventListener('click', () => {
            this.applyFilter();
        });

        document.getElementById('resetFilter')?.addEventListener('click', () => {
            this.resetFilter();
        });

        // 筛选条件变化时自动应用
        document.getElementById('genreFilter')?.addEventListener('change', (e) => {
            this.currentFilter.genre = e.target.value;
            this.applyFilter();
        });

        document.getElementById('yearFilter')?.addEventListener('change', (e) => {
            this.currentFilter.year = e.target.value;
            this.applyFilter();
        });

        document.getElementById('ratingFilter')?.addEventListener('change', (e) => {
            this.currentFilter.rating = e.target.value;
            this.applyFilter();
        });

        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentFilter.sort = e.target.value;
            this.applyFilter();
        });
    }

    applyFilter() {
        this.currentFilter = {
            genre: document.getElementById('genreFilter')?.value || '',
            year: document.getElementById('yearFilter')?.value || '',
            rating: document.getElementById('ratingFilter')?.value || '',
            sort: document.getElementById('sortFilter')?.value || 'rating_desc'
        };
        
        this.currentPage = 1;
        this.loadMovies();
        this.updateResultCount();
        this.updateFilterSummary();
        
        // 平滑滚动到电影列表顶部
        document.getElementById('movieList')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    resetFilter() {
        document.getElementById('genreFilter').value = '';
        document.getElementById('yearFilter').value = '';
        document.getElementById('ratingFilter').value = '';
        document.getElementById('sortFilter').value = 'rating_desc';
        
        this.currentFilter = {
            genre: '',
            year: '',
            rating: '',
            sort: 'rating_desc'
        };
        
        this.currentPage = 1;
        this.loadMovies();
        this.updateResultCount();
        this.updateFilterSummary();
    }

    loadMovies() {
        let filteredMovies = [...window.movies];
        
        // 应用类型筛选
        if (this.currentFilter.genre) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.genre.includes(this.currentFilter.genre)
            );
        }
        
        // 应用年份筛选
        if (this.currentFilter.year) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.year == this.currentFilter.year
            );
        }
        
        // 应用评分筛选
        if (this.currentFilter.rating) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.rating >= parseFloat(this.currentFilter.rating)
            );
        }
        
        // 保存总结果数
        this.totalResults = filteredMovies.length;
        
        // 应用排序
        filteredMovies.sort((a, b) => {
            switch (this.currentFilter.sort) {
                case 'rating_desc':
                    return b.rating - a.rating;
                case 'rating_asc':
                    return a.rating - b.rating;
                case 'year_desc':
                    return b.year - a.year;
                case 'year_asc':
                    return a.year - b.year;
                case 'title_asc':
                    return a.title.localeCompare(b.title, 'zh-CN');
                case 'title_desc':
                    return b.title.localeCompare(a.title, 'zh-CN');
                default:
                    return b.rating - a.rating;
            }
        });
        
        // 计算分页
        const totalPages = Math.ceil(filteredMovies.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageMovies = filteredMovies.slice(startIndex, endIndex);
        
        // 渲染电影
        this.renderMovies(pageMovies);
        
        // 更新分页
        this.updatePagination(totalPages);
        
        // 显示/隐藏无结果提示
        const noMovies = document.getElementById('noMovies');
        const movieList = document.getElementById('movieList');
        const pagination = document.getElementById('pagination');
        
        if (filteredMovies.length === 0) {
            if (noMovies) noMovies.style.display = 'block';
            if (movieList) movieList.style.display = 'none';
            if (pagination) pagination.style.display = 'none';
        } else {
            if (noMovies) noMovies.style.display = 'none';
            if (movieList) movieList.style.display = 'grid';
        }
    }

    renderMovies(movies) {
        const container = document.getElementById('movieList');
        if (!container) return;
        
        container.innerHTML = movies.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
                <div class="movie-card-inner">
                    <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
                    <div class="movie-overlay">
                        <div class="movie-overlay-content">
                            <h3>${movie.title}</h3>
                            <p class="movie-year">${movie.year}</p>
                            <div class="movie-rating-badge">
                                <i class="fas fa-star"></i> ${movie.rating}
                            </div>
                            <button class="quick-view-btn" data-id="${movie.id}">
                                <i class="fas fa-eye"></i> 查看详情
                            </button>
                        </div>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="movie-year-small">${movie.year}</span>
                        <span class="movie-rating">⭐ ${movie.rating}</span>
                    </div>
                    <div class="movie-tags">
                        ${movie.genre.slice(0, 2).map(genre => `<span class="tag">${genre}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        // 添加点击事件
        container.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // 如果点击的是快速查看按钮，不执行卡片点击
                if (e.target.closest('.quick-view-btn')) {
                    return;
                }
                const movieId = card.dataset.id;
                window.location.href = `movie-detail.html?id=${movieId}`;
            });
        });
        
        // 快速查看按钮事件
        container.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const movieId = btn.dataset.id;
                window.location.href = `movie-detail.html?id=${movieId}`;
            });
        });
    }

    setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        pagination.addEventListener('click', (e) => {
            const target = e.target.closest('.page-btn');
            if (!target || target.classList.contains('disabled')) return;
            
            if (target.classList.contains('prev')) {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadMovies();
                    this.scrollToTop();
                }
            } else if (target.classList.contains('next')) {
                const totalPages = Math.ceil(this.totalResults / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.loadMovies();
                    this.scrollToTop();
                }
            } else {
                const pageNum = parseInt(target.textContent);
                if (!isNaN(pageNum)) {
                    this.currentPage = pageNum;
                    this.loadMovies();
                    this.scrollToTop();
                }
            }
        });
    }

    updatePagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        let paginationHtml = '';
        
        // 上一页按钮
        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        paginationHtml += `<button class="page-btn prev ${prevDisabled}"><i class="fas fa-chevron-left"></i></button>`;
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页
        if (startPage > 1) {
            paginationHtml += `<button class="page-btn">1</button>`;
            if (startPage > 2) {
                paginationHtml += `<span class="page-ellipsis">...</span>`;
            }
        }
        
        // 中间页码
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHtml += `<button class="page-btn ${activeClass}">${i}</button>`;
        }
        
        // 最后一页
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<span class="page-ellipsis">...</span>`;
            }
            paginationHtml += `<button class="page-btn">${totalPages}</button>`;
        }
        
        // 下一页按钮
        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
        paginationHtml += `<button class="page-btn next ${nextDisabled}"><i class="fas fa-chevron-right"></i></button>`;
        
        pagination.innerHTML = paginationHtml;
    }

    updateResultCount() {
        const header = document.querySelector('.movie-list-header p');
        if (header) {
            const filterActive = this.currentFilter.genre || this.currentFilter.year || this.currentFilter.rating;
            if (filterActive) {
                header.textContent = `找到 ${this.totalResults} 部电影`;
            } else {
                header.textContent = `探索数千部精彩电影 (共 ${this.totalResults} 部)`;
            }
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateFilterSummary() {
        const summary = document.getElementById('filterSummary');
        const summaryTags = document.getElementById('summaryTags');
        
        if (!summary || !summaryTags) return;
        
        const tags = [];
        
        if (this.currentFilter.genre) {
            tags.push({ label: `类型: ${this.currentFilter.genre}`, key: 'genre' });
        }
        
        if (this.currentFilter.year) {
            tags.push({ label: `年份: ${this.currentFilter.year}`, key: 'year' });
        }
        
        if (this.currentFilter.rating) {
            tags.push({ label: `评分: ${this.currentFilter.rating}+`, key: 'rating' });
        }
        
        if (tags.length === 0) {
            summary.style.display = 'none';
        } else {
            summary.style.display = 'flex';
            summaryTags.innerHTML = tags.map(tag => `
                <div class="summary-tag">
                    ${tag.label}
                    <i class="fas fa-times" data-filter="${tag.key}"></i>
                </div>
            `).join('');
            
            // 添加删除筛选事件
            summaryTags.querySelectorAll('i').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    const filterKey = e.target.dataset.filter;
                    this.removeFilter(filterKey);
                });
            });
        }
    }

    removeFilter(filterKey) {
        const filterMap = {
            'genre': 'genreFilter',
            'year': 'yearFilter',
            'rating': 'ratingFilter'
        };
        
        const selectId = filterMap[filterKey];
        if (selectId) {
            document.getElementById(selectId).value = '';
            this.currentFilter[filterKey] = '';
            this.applyFilter();
        }
    }
}

// 初始化电影列表
document.addEventListener('DOMContentLoaded', function() {
    new MovieList();
});
