// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 如果已登录，跳转到首页
    if (window.userManager && window.userManager.isLoggedIn()) {
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    }
    
    // 初始化表单验证
    initFormValidation();
    
    // 设置表单提交事件
    setupFormSubmit();
    
    // 密码强度检测
    setupPasswordStrength();
});

// 初始化表单验证
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('input', function(e) {
            if (e.target.id === 'username') validateUsername(e.target);
            if (e.target.id === 'password') validatePassword(e.target);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('input', function(e) {
            if (e.target.id === 'regUsername') validateRegisterUsername(e.target);
            if (e.target.id === 'regEmail') validateEmail(e.target);
            if (e.target.id === 'regPassword') validateRegisterPassword(e.target);
            if (e.target.id === 'confirmPassword') validateConfirmPassword(e.target);
        });
    }
}

// 设置表单提交事件
function setupFormSubmit() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                
                const result = window.userManager.login(username, password);
                
                if (result.success) {
                    showMessage('登录成功！正在跳转...', 'success');
                    setTimeout(() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirectTo = urlParams.get('redirect');
                        window.location.href = redirectTo || 'index.html';
                    }, 1500);
                } else {
                    showMessage(result.message || '登录失败', 'error');
                }
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateRegisterForm()) {
                const userData = {
                    username: document.getElementById('regUsername').value,
                    email: document.getElementById('regEmail').value,
                    password: document.getElementById('regPassword').value
                };
                
                const result = window.userManager.register(userData);
                
                if (result.success) {
                    showMessage('注册成功！正在跳转到登录页面...', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage(result.message || '注册失败', 'error');
                }
            }
        });
    }
}

// 表单验证函数
function validateLoginForm() {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    let isValid = true;
    
    if (!username.value.trim()) {
        showError(username, '用户名不能为空');
        isValid = false;
    } else {
        clearError(username);
    }
    
    if (!password.value) {
        showError(password, '密码不能为空');
        isValid = false;
    } else if (password.value.length < 6) {
        showError(password, '密码至少6位');
        isValid = false;
    } else {
        clearError(password);
    }
    
    return isValid;
}

function validateRegisterForm() {
    const username = document.getElementById('regUsername');
    const email = document.getElementById('regEmail');
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    let isValid = true;
    
    if (!validateRegisterUsername(username)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validateRegisterPassword(password)) isValid = false;
    if (!validateConfirmPassword(confirmPassword)) isValid = false;
    
    return isValid;
}

function validateUsername(input) {
    if (!input.value.trim()) {
        showError(input, '用户名不能为空');
        return false;
    }
    clearError(input);
    return true;
}

function validateRegisterUsername(input) {
    const value = input.value.trim();
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    
    if (!value) {
        showError(input, '用户名不能为空');
        return false;
    }
    
    if (value.length < 3 || value.length > 20) {
        showError(input, '用户名长度为3-20个字符');
        return false;
    }
    
    if (!usernameRegex.test(value)) {
        showError(input, '用户名只能包含字母、数字和下划线');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!input.value) {
        showError(input, '邮箱不能为空');
        return false;
    }
    
    if (!emailRegex.test(input.value)) {
        showError(input, '请输入有效的邮箱地址');
        return false;
    }
    
    clearError(input);
    return true;
}

function validatePassword(input) {
    if (!input.value) {
        showError(input, '密码不能为空');
        return false;
    }
    
    if (input.value.length < 6) {
        showError(input, '密码至少6位');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateRegisterPassword(input) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (!input.value) {
        showError(input, '密码不能为空');
        return false;
    }
    
    if (input.value.length < 8) {
        showError(input, '密码至少8位');
        return false;
    }
    
    if (!passwordRegex.test(input.value)) {
        showError(input, '密码必须包含字母和数字');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateConfirmPassword(input) {
    const password = document.getElementById('regPassword')?.value;
    
    if (!input.value) {
        showError(input, '请确认密码');
        return false;
    }
    
    if (input.value !== password) {
        showError(input, '两次输入的密码不一致');
        return false;
    }
    
    clearError(input);
    return true;
}

// 显示错误信息
function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }
}

// 清除错误信息
function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.style.display = 'none';
    }
}

// 密码强度检测
function setupPasswordStrength() {
    const passwordInput = document.getElementById('regPassword');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const strengthBar = document.getElementById('passwordStrength');
        if (!strengthBar) return;
        
        const password = this.value;
        let strength = 'weak';
        
        if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            strength = 'strong';
        } else if (password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
            strength = 'medium';
        }
        
        strengthBar.className = 'strength-bar ' + strength;
    });
}

// 显示消息
function showMessage(message, type) {
    const existingMsg = document.querySelector('.message-alert');
    if (existingMsg) existingMsg.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-alert ${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button class="close-btn">&times;</button>
    `;
    
    const form = document.querySelector('.auth-form');
    if (form) {
        form.prepend(messageDiv);
    } else {
        document.body.prepend(messageDiv);
    }
    
    messageDiv.querySelector('.close-btn').addEventListener('click', () => {
        messageDiv.remove();
    });
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}