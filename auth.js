// ===================================
// AUTH SYSTEM JAVASCRIPT
// ===================================

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
});

function initializeAuth() {
    setupLoginForm();
    setupRegistrationForm();
    setupPasswordStrength();
    checkIfLoggedIn();
}

// Check if user is already logged in
function checkIfLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Redirect to main store if already logged in
        window.location.href = 'index.html';
    }
}

// ===================================
// LOGIN FORM
// ===================================
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (!loginForm) {
        console.error('Login form not found');
        return;
    }
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        const remember = event.target.remember.checked;
        
        // Validate inputs
        if (!email || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Find user
        const user = users.find(u => u.email === email);
        
        if (!user) {
            showNotification('User not found. Please register first.', 'error');
            return;
        }
        
        // Verify password
        if (user.password !== password) {
            showNotification('Incorrect password. Please try again.', 'error');
            return;
        }
        
        // Login successful
        const currentUser = {
            username: user.username,
            email: user.email,
            loggedInAt: new Date().toISOString()
        };
        
        // Save current user
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Handle remember me
        if (remember) {
            localStorage.setItem('rememberUser', 'true');
        }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Add loading state
        const submitBtn = loginForm.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        
        // Redirect to main store after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// ===================================
// REGISTRATION FORM
// ===================================
function setupRegistrationForm() {
    const registrationForm = document.getElementById('registration-form');
    
    if (!registrationForm) {
        console.error('Registration form not found');
        return;
    }
    
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = event.target.username.value.trim();
        const email = event.target.email.value.trim();
        const password = event.target.password.value;
        const confirmPassword = event.target.confirmPassword.value;
        const termsAccepted = event.target.terms.checked;
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (username.length < 3) {
            showNotification('Username must be at least 3 characters', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        if (!termsAccepted) {
            showNotification('Please accept the terms and conditions', 'error');
            return;
        }
        
        // Check password strength
        const strength = checkPasswordStrength(password);
        if (strength === 'weak') {
            showNotification('Please use a stronger password', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showNotification('User already exists. Please login instead.', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            username: username,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        const currentUser = {
            username: newUser.username,
            email: newUser.email,
            loggedInAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Registration successful! Redirecting...', 'success');
        
        // Add loading state
        const submitBtn = registrationForm.querySelector('.btn-submit');
        submitBtn.classList.add('loading');
        
        // Redirect to main store after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// ===================================
// PASSWORD STRENGTH CHECKER
// ===================================
function setupPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        updateStrengthUI(strength);
    });
}

function checkPasswordStrength(password) {
    if (password.length === 0) return 'none';
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++; // lowercase
    if (/[A-Z]/.test(password)) strength++; // uppercase
    if (/[0-9]/.test(password)) strength++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) strength++; // special chars
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function updateStrengthUI(strength) {
    const strengthBar = document.getElementById('strength-bar-fill');
    const strengthText = document.getElementById('strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    // Remove all classes
    strengthBar.className = 'strength-bar-fill';
    strengthText.className = 'strength-text';
    
    switch(strength) {
        case 'weak':
            strengthBar.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Weak password';
            break;
        case 'medium':
            strengthBar.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Medium strength';
            break;
        case 'strong':
            strengthBar.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong password';
            break;
        default:
            strengthText.textContent = 'Password strength';
    }
}

// ===================================
// TOGGLE PASSWORD VISIBILITY
// ===================================
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.toggle-password');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// ===================================
// SWITCH BETWEEN LOGIN/REGISTER
// ===================================
function switchToRegister(event) {
    event.preventDefault();
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('register-section').classList.add('active');
}

function switchToLogin(event) {
    event.preventDefault();
    document.getElementById('register-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notification-toast');
    
    // Set content
    toast.textContent = message;
    
    // Set type
    toast.className = `notification-toast ${type}`;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// EMAIL VALIDATION
// ===================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================================
// SOCIAL LOGIN (Placeholder)
// ===================================
document.querySelectorAll('.btn-social').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        showNotification(`${provider} login coming soon!`, 'error');
    });
});

// ===================================
// CONSOLE WELCOME
// ===================================
console.log('%c🔐 ShopHub Auth System', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c✨ Secure Login & Registration', 'color: #f59e0b; font-size: 14px;');