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
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMovies();
        this.setupPagination();
    }

    setupEventListeners() {
        // 筛选按钮
        document.getElementById('applyFilter')?.addEventListener('click', () => {
            this.applyFilter();
        });

        document.getElementById('resetFilter')?.addEventListener('click', () => {
            this.resetFilter();
        });

        // 筛选条件变化时自动应用（可选）
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
        if (filteredMovies.length === 0) {
            noMovies.style.display = 'block';
        } else {
            noMovies.style.display = 'none';
        }
    }

    renderMovies(movies) {
        const container = document.getElementById('movieList');
        if (!container) return;
        
        container.innerHTML = movies.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.year}</span>
                        <span class="movie-rating">${movie.rating}</span>
                    </div>
                    <p class="movie-desc">${movie.description.substring(0, 80)}...</p>
                    <div class="movie-tags">
                        ${movie.genre.slice(0, 2).map(genre => `<span class="tag">${genre}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        // 添加点击事件
        container.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.dataset.id;
                window.location.href = `movie-detail.html?id=${movieId}`;
            });
        });
    }

    setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        pagination.addEventListener('click', (e) => {
            const target = e.target.closest('.page-btn');
            if (!target) return;
            
            if (target.classList.contains('prev')) {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadMovies();
                }
            } else if (target.classList.contains('next')) {
                this.currentPage++;
                this.loadMovies();
            } else if (!target.classList.contains('disabled')) {
                const pageNum = parseInt(target.textContent);
                if (!isNaN(pageNum)) {
                    this.currentPage = pageNum;
                    this.loadMovies();
                }
            }
        });
    }

    updatePagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination || totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        let paginationHtml = '';
        
        // 上一页按钮
        if (this.currentPage === 1) {
            paginationHtml += '<button class="page-btn prev disabled"><i class="fas fa-chevron-left"></i></button>';
        } else {
            paginationHtml += '<button class="page-btn prev"><i class="fas fa-chevron-left"></i></button>';
        }
        
        // 页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            if (i === this.currentPage) {
                paginationHtml += `<button class="page-btn active">${i}</button>`;
            } else {
                paginationHtml += `<button class="page-btn">${i}</button>`;
            }
        }
        
        // 下一页按钮
        if (this.currentPage === totalPages) {
            paginationHtml += '<button class="page-btn next disabled"><i class="fas fa-chevron-right"></i></button>';
        } else {
            paginationHtml += '<button class="page-btn next"><i class="fas fa-chevron-right"></i></button>';
        }
        
        pagination.innerHTML = paginationHtml;
    }
}

// 电影详情页逻辑
class MovieDetail {
    constructor() {
        this.movieId = null;
        this.movie = null;
        this.init();
    }

    init() {
        this.getMovieId();
        if (this.movieId) {
            this.loadMovieDetail();
            this.setupEventListeners();
        } else {
            this.showError();
        }
    }

    getMovieId() {
        const urlParams = new URLSearchParams(window.location.search);
        this.movieId = parseInt(urlParams.get('id'));
    }

    loadMovieDetail() {
        // 显示加载状态
        const loading = document.getElementById('loading');
        const detailPage = document.querySelector('.movie-detail-page');
        const errorMessage = document.getElementById('errorMessage');
        
        if (loading) loading.style.display = 'block';
        if (detailPage) detailPage.style.display = 'none';
        if (errorMessage) errorMessage.style.display = 'none';

        // 检查电影数据是否加载
        if (!window.movies || !Array.isArray(window.movies)) {
            console.error('Movies data not loaded');
            setTimeout(() => this.loadMovieDetail(), 100);
            return;
        }

        // 从数据中查找电影
        this.movie = window.movies.find(m => m.id === this.movieId);

        setTimeout(() => {
            if (loading) loading.style.display = 'none';
            
            if (this.movie) {
                if (detailPage) detailPage.style.display = 'block';
                this.renderMovieDetail();
                this.loadRelatedMovies();
                
                // 添加到观看历史
                if (window.userManager && window.userManager.isLoggedIn()) {
                    window.userManager.addWatchHistory(this.movieId);
                }
            } else {
                this.showError();
            }
        }, 500);
    }

    renderMovieDetail() {
        if (!this.movie) return;

        // 更新页面标题
        document.title = `${this.movie.title} - 我的电影`;
        
        // 更新面包屑
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = this.movie.title;

        // 更新海报
        const poster = document.getElementById('detailPoster');
        if (poster) {
            poster.src = this.movie.poster;
            poster.alt = this.movie.title;
        }

        // 更新标题
        const title = document.getElementById('detailTitle');
        if (title) title.textContent = this.movie.title;

        // 更新元信息
        const meta = document.getElementById('detailMeta');
        if (meta) {
            meta.innerHTML = `
                <span>${this.movie.year}</span> · 
                <span>${this.movie.duration}</span> · 
                <span>${this.movie.country}</span> · 
                <span>${this.movie.language}</span>
            `;
        }

        // 更新评分
        const stars = document.getElementById('detailStars');
        const score = document.getElementById('detailScore');
        if (stars && score) {
            const fullStars = Math.floor(this.movie.rating / 2);
            const hasHalfStar = (this.movie.rating % 2) >= 1;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            
            stars.innerHTML = 
                '★'.repeat(fullStars) + 
                (hasHalfStar ? '⯨' : '') + 
                '☆'.repeat(emptyStars);
            score.textContent = `${this.movie.rating} / 10`;
        }

        // 更新类型标签
        const genres = document.getElementById('detailGenres');
        if (genres) {
            genres.innerHTML = this.movie.genre.map(g => 
                `<span class="tag">${g}</span>`
            ).join('');
        }

        // 更新剧情简介
        const overview = document.getElementById('detailOverview');
        if (overview) overview.textContent = this.movie.description;

        // 更新收藏按钮状态
        this.updateFavoriteButton();
    }

    setupEventListeners() {
        // 播放按钮
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.openVideoPlayer();
            });
        }

        // 收藏按钮
        const favBtn = document.getElementById('favBtn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }

        // 视频播放器事件
        this.setupVideoPlayerEvents();
    }

    // 打开视频播放器
    openVideoPlayer() {
        if (!this.movie) return;

        const modal = document.getElementById('videoPlayerModal');
        const videoPlayer = document.getElementById('videoPlayer');
        const videoSource = document.getElementById('videoSource');
        const videoTitle = document.getElementById('videoTitle');

        if (!modal || !videoPlayer || !videoSource) {
            this.showMessage('播放器加载失败', 'error');
            return;
        }

        // 设置视频源
        if (this.movie.video) {
            videoSource.src = this.movie.video;
            videoPlayer.load();
            videoTitle.textContent = `正在播放：${this.movie.title}`;
            
            // 显示模态框
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // 尝试播放
            videoPlayer.play().catch(e => {
                console.log('自动播放被阻止，需要用户交互');
            });
        } else {
            this.showMessage('该电影暂无播放源', 'warning');
        }
    }

    // 关闭视频播放器
    closeVideoPlayer() {
        const modal = document.getElementById('videoPlayerModal');
        const videoPlayer = document.getElementById('videoPlayer');

        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        }
    }

    // 设置视频播放器事件
    setupVideoPlayerEvents() {
        const modal = document.getElementById('videoPlayerModal');
        const closeBtn = document.getElementById('closeVideoBtn');
        const videoPlayer = document.getElementById('videoPlayer');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');

        // 关闭按钮
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeVideoPlayer();
            });
        }

        // 点击模态框背景关闭
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeVideoPlayer();
                }
            });
        }

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeVideoPlayer();
            }
        });

        // 视频时间更新
        if (videoPlayer) {
            videoPlayer.addEventListener('loadedmetadata', () => {
                if (durationEl) {
                    durationEl.textContent = this.formatTime(videoPlayer.duration);
                }
            });

            videoPlayer.addEventListener('timeupdate', () => {
                if (currentTimeEl) {
                    currentTimeEl.textContent = this.formatTime(videoPlayer.currentTime);
                }
            });
        }

        // 全屏按钮
        if (fullscreenBtn && videoPlayer) {
            fullscreenBtn.addEventListener('click', () => {
                if (videoPlayer.requestFullscreen) {
                    videoPlayer.requestFullscreen();
                } else if (videoPlayer.webkitRequestFullscreen) {
                    videoPlayer.webkitRequestFullscreen();
                } else if (videoPlayer.msRequestFullscreen) {
                    videoPlayer.msRequestFullscreen();
                }
            });
        }
    }

    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateFavoriteButton() {
        const favBtn = document.getElementById('favBtn');
        if (!favBtn) return;

        if (window.userManager && window.userManager.isLoggedIn()) {
            const isFavorite = window.userManager.isFavorite(this.movieId);
            
            if (isFavorite) {
                favBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
                favBtn.classList.add('active');
            } else {
                favBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
                favBtn.classList.remove('active');
            }
        } else {
            favBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
            favBtn.classList.remove('active');
        }
    }

    toggleFavorite() {
        if (!window.userManager || !window.userManager.isLoggedIn()) {
            alert('请先登录后再收藏');
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
            return;
        }

        const isFavorite = window.userManager.isFavorite(this.movieId);
        
        if (isFavorite) {
            if (window.userManager.removeFavorite(this.movieId)) {
                this.showMessage('已取消收藏', 'success');
                this.updateFavoriteButton();
            }
        } else {
            if (window.userManager.addFavorite(this.movieId)) {
                this.showMessage('收藏成功', 'success');
                this.updateFavoriteButton();
            } else {
                this.showMessage('该电影已在收藏列表中', 'warning');
            }
        }
    }

    loadRelatedMovies() {
        if (!this.movie) return;

        const container = document.getElementById('relatedMovies');
        if (!container) return;

        // 找到同类型的电影
        const related = window.movies
            .filter(m => {
                if (m.id === this.movieId) return false;
                return m.genre.some(g => this.movie.genre.includes(g));
            })
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

        if (related.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">暂无相关推荐</p>';
            return;
        }

        container.innerHTML = related.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.year}</span>
                        <span class="movie-rating">⭐ ${movie.rating}</span>
                    </div>
                    <p class="movie-desc">${movie.description.substring(0, 60)}...</p>
                </div>
            </div>
        `).join('');

        // 添加点击事件
        container.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => {
                const movieId = card.dataset.id;
                window.location.href = `movie-detail.html?id=${movieId}`;
            });
        });
    }

    showError() {
        const loading = document.getElementById('loading');
        const detailPage = document.querySelector('.movie-detail-page');
        const errorMessage = document.getElementById('errorMessage');
        
        if (loading) loading.style.display = 'none';
        if (detailPage) detailPage.style.display = 'none';
        if (errorMessage) {
            errorMessage.style.display = 'block';
            // 添加更详细的错误信息
            const errorText = errorMessage.querySelector('p');
            if (errorText && this.movieId) {
                errorText.innerHTML = `找不到 ID 为 ${this.movieId} 的电影。<br>请稍后重试或返回<a href="movie-list.html">电影库</a>`;
            }
        }
    }

    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-alert ${type}`;
        messageDiv.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 250px; animation: slideIn 0.3s ease;';
        messageDiv.innerHTML = `
            <span>${message}</span>
            <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 根据页面决定初始化哪个功能
    if (window.location.pathname.includes('movie-list.html')) {
        new MovieList();
        document.title = '电影库 - 我的电影';
    } else if (window.location.pathname.includes('movie-detail.html')) {
        new MovieDetail();
    }
});