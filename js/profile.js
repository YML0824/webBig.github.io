// 个人中心页面逻辑
class UserProfile {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.loadUserProfile();
        this.setupEventListeners();
    }

    checkLoginStatus() {
        if (!window.userManager || !window.userManager.isLoggedIn()) {
            alert('请先登录');
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
            return false;
        }
        
        this.currentUser = window.userManager.getCurrentUser();
        return true;
    }

    loadUserProfile() {
        if (!this.currentUser) return;
        
        // 更新个人信息
        document.getElementById('userAvatar').src = this.currentUser.avatar;
        document.getElementById('userName').textContent = this.currentUser.username;
        document.getElementById('userUsername').textContent = this.currentUser.username;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        document.getElementById('joinDate').textContent = `加入日期：${this.currentUser.joinDate}`;
        document.getElementById('favoriteCount').textContent = `收藏：${this.currentUser.favorites.length} 部`;
        
        // 加载统计数据
        this.loadStatistics();
        
        // 加载收藏的电影
        this.loadFavoriteMovies();
        
        // 加载最近活动
        this.loadRecentActivity();
    }

    loadStatistics() {
        if (!this.currentUser) return;
        
        // 收藏数量
        document.getElementById('statFavorites').textContent = this.currentUser.favorites.length;
        
        // 观看记录数量
        const watchHistory = this.currentUser.watchHistory || [];
        document.getElementById('statWatched').textContent = watchHistory.length;
        
        // 影评数量
        const reviews = JSON.parse(localStorage.getItem('movieReviews') || '[]')
            .filter(review => review.userId === this.currentUser.id);
        document.getElementById('statReviews').textContent = reviews.length;
        
        // 平均评分
        const avgRating = reviews.length > 0 
            ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
            : '0.0';
        document.getElementById('statAvgRating').textContent = avgRating;
    }

    loadFavoriteMovies() {
        if (!this.currentUser) return;
        
        const container = document.getElementById('favoriteMovies');
        const noFavorites = document.getElementById('noFavorites');
        
        if (!container || !noFavorites) return;
        
        if (this.currentUser.favorites.length === 0) {
            container.style.display = 'none';
            noFavorites.style.display = 'block';
            return;
        }
        
        // 从电影数据中筛选收藏的电影（最多显示6部）
        const favoriteMovies = window.movies
            .filter(movie => this.currentUser.favorites.includes(movie.id))
            .slice(0, 6);
        
        if (favoriteMovies.length === 0) {
            container.style.display = 'none';
            noFavorites.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        noFavorites.style.display = 'none';
        
        container.innerHTML = favoriteMovies.map(movie => `
            <div class="movie-card" data-id="${movie.id}">
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.year}</span>
                        <span class="movie-rating">⭐ ${movie.rating}</span>
                    </div>
                    <p class="movie-desc">${movie.description.substring(0, 80)}...</p>
                    <button class="btn btn-danger btn-sm remove-favorite" data-id="${movie.id}">
                        <i class="fas fa-trash"></i> 移除
                    </button>
                </div>
            </div>
        `).join('');
        
        // 添加移除收藏事件
        container.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const movieId = parseInt(this.dataset.id);
                if (window.userManager.removeFavorite(movieId)) {
                    // 重新加载页面数据
                    window.location.reload();
                }
            });
        });
        
        // 添加点击跳转事件
        container.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.remove-favorite')) {
                    const movieId = this.dataset.id;
                    window.location.href = `movie-detail.html?id=${movieId}`;
                }
            });
        });
    }

    loadRecentActivity() {
        if (!this.currentUser) return;
        
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        const activities = [];
        
        // 获取最近观看记录
        const watchHistory = this.currentUser.watchHistory || [];
        const recentWatched = watchHistory.slice(0, 3).map(movieId => {
            const movie = window.movies.find(m => m.id === movieId);
            return movie ? {
                type: 'watched',
                title: `观看了《${movie.title}》`,
                time: '刚刚',
                icon: 'fa-eye'
            } : null;
        }).filter(Boolean);
        
        activities.push(...recentWatched);
        
        // 获取最近收藏
        const recentFavorites = this.currentUser.favorites.slice(0, 2).map(movieId => {
            const movie = window.movies.find(m => m.id === movieId);
            return movie ? {
                type: 'favorited',
                title: `收藏了《${movie.title}》`,
                time: '1小时前',
                icon: 'fa-heart'
            } : null;
        }).filter(Boolean);
        
        activities.push(...recentFavorites);
        
        // 获取最近影评
        const reviews = JSON.parse(localStorage.getItem('movieReviews') || '[]')
            .filter(review => review.userId === this.currentUser.id)
            .slice(0, 2);
        
        const recentReviews = reviews.map(review => {
            const movie = window.movies.find(m => m.id === review.movieId);
            return movie ? {
                type: 'reviewed',
                title: `评价了《${movie.title}》`,
                time: '2小时前',
                icon: 'fa-comment'
            } : null;
        }).filter(Boolean);
        
        activities.push(...recentReviews);
        
        // 如果没有活动，显示提示
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-clock"></i>
                    <p>暂无活动记录</p>
                </div>
            `;
            return;
        }
        
        // 渲染活动列表
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .no-activity {
                text-align: center;
                padding: 2rem;
                color: #666;
            }
            
            .no-activity i {
                font-size: 3rem;
                color: #ddd;
                margin-bottom: 1rem;
            }
            
            .view-all {
                text-align: center;
                margin-top: 2rem;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // 退出登录按钮
        document.getElementById('logoutProfileBtn')?.addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                window.userManager.logout();
            }
        });
        
        // 编辑资料按钮
        document.getElementById('editProfileBtn')?.addEventListener('click', () => {
            this.showEditProfileForm();
        });
        
        // 修改密码按钮
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.showChangePasswordForm();
        });
        
        // 通知设置按钮
        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            alert('通知设置功能开发中');
        });
        
        // 头像上传
        document.getElementById('avatarInput')?.addEventListener('change', (e) => {
            this.uploadAvatar(e.target.files[0]);
        });
    }

    showEditProfileForm() {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>编辑个人资料</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="editProfileForm">
                            <div class="form-group">
                                <label for="editUsername">用户名</label>
                                <input type="text" id="editUsername" value="${this.currentUser.username}" required>
                            </div>
                            <div class="form-group">
                                <label for="editEmail">邮箱</label>
                                <input type="email" id="editEmail" value="${this.currentUser.email}" required>
                            </div>
                            <div class="form-group">
                                <label for="editBio">个人简介</label>
                                <textarea id="editBio" rows="3" placeholder="介绍一下自己..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" id="cancelEdit">取消</button>
                        <button class="btn btn-primary" id="saveEdit">保存</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = formHtml;
        document.body.appendChild(modal);
        
        // 关闭按钮
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancelEdit').addEventListener('click', () => modal.remove());
        
        // 保存按钮
        modal.querySelector('#saveEdit').addEventListener('click', () => {
            const newUsername = modal.querySelector('#editUsername').value.trim();
            const newEmail = modal.querySelector('#editEmail').value.trim();
            
            if (!newUsername || !newEmail) {
                alert('请填写完整信息');
                return;
            }
            
            // 更新用户信息（这里简化处理，实际应该调用API）
            this.currentUser.username = newUsername;
            this.currentUser.email = newEmail;
            
            // 更新session
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // 更新localStorage中的用户数据
            this.updateUserInLocalStorage();
            
            alert('资料更新成功');
            modal.remove();
            window.location.reload();
        });
        
        // 点击遮罩层关闭
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });
        
        // 添加模态框样式
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            
            .modal {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                animation: modalSlide 0.3s ease;
            }
            
            @keyframes modalSlide {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #333;
            }
            
            .close-modal {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    showChangePasswordForm() {
        const formHtml = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3>修改密码</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="changePasswordForm">
                            <div class="form-group">
                                <label for="currentPassword">当前密码</label>
                                <input type="password" id="currentPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="newPassword">新密码</label>
                                <input type="password" id="newPassword" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmNewPassword">确认新密码</label>
                                <input type="password" id="confirmNewPassword" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" id="cancelPassword">取消</button>
                        <button class="btn btn-primary" id="savePassword">保存</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = formHtml;
        document.body.appendChild(modal);
        
        // 关闭按钮
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancelPassword').addEventListener('click', () => modal.remove());
        
        // 保存按钮
        modal.querySelector('#savePassword').addEventListener('click', () => {
            const currentPassword = modal.querySelector('#currentPassword').value;
            const newPassword = modal.querySelector('#newPassword').value;
            const confirmNewPassword = modal.querySelector('#confirmNewPassword').value;
            
            if (!currentPassword || !newPassword || !confirmNewPassword) {
                alert('请填写所有密码字段');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('新密码至少需要8位');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                alert('两次输入的新密码不一致');
                return;
            }
            
            // 验证当前密码
            const users = JSON.parse(localStorage.getItem('movieUsers') || '[]');
            const userIndex = users.findIndex(u => u.id === this.currentUser.id);
            
            if (userIndex === -1) {
                alert('用户不存在');
                return;
            }
            
            if (users[userIndex].password !== currentPassword) {
                alert('当前密码错误');
                return;
            }
            
            // 更新密码
            users[userIndex].password = newPassword;
            localStorage.setItem('movieUsers', JSON.stringify(users));
            
            alert('密码修改成功');
            modal.remove();
        });
        
        // 点击遮罩层关闭
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                modal.remove();
            }
        });
    }

    uploadAvatar(file) {
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过5MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // 更新头像显示
            document.getElementById('userAvatar').src = e.target.result;
            
            // 更新用户数据
            this.currentUser.avatar = e.target.result;
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // 更新localStorage
            this.updateUserInLocalStorage();
            
            alert('头像更新成功');
        };
        
        reader.readAsDataURL(file);
    }

    updateUserInLocalStorage() {
        const users = JSON.parse(localStorage.getItem('movieUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            // 更新用户信息（保留密码）
            const password = users[userIndex].password;
            users[userIndex] = { ...this.currentUser, password };
            localStorage.setItem('movieUsers', JSON.stringify(users));
        }
    }
}

// 初始化个人中心
document.addEventListener('DOMContentLoaded', function() {
    new UserProfile();
    
    // 更新页面标题
    const user = window.userManager?.getCurrentUser();
    if (user) {
        document.title = `${user.username}的个人中心 - 我的电影`;
    }
});