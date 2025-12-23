// 用户管理模块
class UserManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUsers();
        this.loadCurrentUser();
        this.updateUI();
    }

    // 用户数据管理
    loadUsers() {
        if (!localStorage.getItem('movieUsers')) {
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@movie.com',
                    password: 'Admin123',
                    avatar: 'https://picsum.photos/100/100?random=1',
                    joinDate: '2023-01-01',
                    favorites: [1, 2, 3],
                    watchHistory: []
                },
                {
                    id: 2,
                    username: 'user1',
                    email: 'user1@movie.com',
                    password: 'User1234',
                    avatar: 'https://picsum.photos/100/100?random=2',
                    joinDate: '2023-06-15',
                    favorites: [4, 5],
                    watchHistory: []
                }
            ];
            localStorage.setItem('movieUsers', JSON.stringify(defaultUsers));
        }
    }

    // 获取所有用户
    getUsers() {
        return JSON.parse(localStorage.getItem('movieUsers') || '[]');
    }

    // 保存用户
    saveUsers(users) {
        localStorage.setItem('movieUsers', JSON.stringify(users));
    }

    // 登录
    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );

        if (user) {
            const userSession = { ...user };
            delete userSession.password;
            
            sessionStorage.setItem('currentUser', JSON.stringify(userSession));
            this.currentUser = userSession;
            this.updateUI();
            
            return {
                success: true,
                user: userSession
            };
        }

        return {
            success: false,
            message: '用户名或密码错误'
        };
    }

    // 注册
    register(userData) {
        const users = this.getUsers();
        
        if (users.some(u => u.username === userData.username)) {
            return {
                success: false,
                message: '用户名已存在'
            };
        }

        if (users.some(u => u.email === userData.email)) {
            return {
                success: false,
                message: '邮箱已被注册'
            };
        }

        const newUser = {
            id: Date.now(),
            ...userData,
            avatar: `https://picsum.photos/100/100?random=${users.length + 1}`,
            joinDate: new Date().toISOString().split('T')[0],
            favorites: [],
            watchHistory: []
        };

        users.push(newUser);
        this.saveUsers(users);

        return {
            success: true,
            user: newUser
        };
    }

    // 登出
    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateUI();
        window.location.href = 'index.html';
    }

    // 加载当前用户
    loadCurrentUser() {
        const userStr = sessionStorage.getItem('currentUser');
        if (userStr) {
            this.currentUser = JSON.parse(userStr);
        }
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // 更新UI显示
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) return;

        if (this.isLoggedIn()) {
            authButtons.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-menu">
                        <img src="${this.currentUser.avatar}" alt="用户头像" class="user-avatar">
                        <span>${this.currentUser.username}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="user-profile.html" class="dropdown-item">
                            <i class="fas fa-user"></i> 个人中心
                        </a>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-heart"></i> 我的收藏
                        </a>
                        <a href="#" class="dropdown-item">
                            <i class="fas fa-history"></i> 浏览历史
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i> 退出登录
                        </a>
                    </div>
                </div>
            `;

            document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="btn btn-outline">登录</a>
                <a href="register.html" class="btn btn-primary">注册</a>
            `;
        }
    }

    // 添加收藏
    addFavorite(movieId) {
        if (!this.isLoggedIn()) {
            alert('请先登录');
            return false;
        }

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) return false;

        if (!users[userIndex].favorites.includes(movieId)) {
            users[userIndex].favorites.push(movieId);
            this.saveUsers(users);
            
            this.currentUser.favorites.push(movieId);
            sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            return true;
        }
        return false;
    }

    // 移除收藏
    removeFavorite(movieId) {
        if (!this.isLoggedIn()) return false;

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) return false;

        users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== movieId);
        this.saveUsers(users);
        
        this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== movieId);
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    }

    // 检查是否已收藏
    isFavorite(movieId) {
        if (!this.isLoggedIn()) return false;
        return this.currentUser.favorites.includes(movieId);
    }

    // 添加观看历史
    addWatchHistory(movieId) {
        if (!this.isLoggedIn()) return;

        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) return;

        // 移除重复的，保持最近观看在最前
        users[userIndex].watchHistory = users[userIndex].watchHistory.filter(id => id !== movieId);
        users[userIndex].watchHistory.unshift(movieId);
        
        // 只保留最近20条
        if (users[userIndex].watchHistory.length > 20) {
            users[userIndex].watchHistory = users[userIndex].watchHistory.slice(0, 20);
        }
        
        this.saveUsers(users);
        
        this.currentUser.watchHistory = users[userIndex].watchHistory;
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // 获取观看历史
    getWatchHistory() {
        if (!this.isLoggedIn()) return [];
        return this.currentUser.watchHistory || [];
    }
}

// 全局用户管理实例
window.userManager = new UserManager();