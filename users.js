// User Account System for Yiwu Game

const userSystem = {
    // Current logged in user
    currentUser: null,
    
    // Initialize the user system
    init: function() {
        // Check if a user is already logged in (from localStorage)
        this.checkLoginStatus();
        
        // Add login/register buttons to the header if not already present
        this.updateHeaderUI();
        
        // Setup event listeners for login/register modal if it exists
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            this.setupAuthForms();
        }
    },
    
    // Check if user is logged in from localStorage
    checkLoginStatus: function() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('User logged in:', this.currentUser.username);
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('currentUser');
            }
        }
    },
    
    // Update the header UI based on login status
    updateHeaderUI: function() {
        const headerNav = document.querySelector('header nav div.flex');
        if (!headerNav) return;
        
        // Remove existing auth buttons if they exist
        const existingAuthButtons = document.getElementById('auth-buttons');
        if (existingAuthButtons) {
            existingAuthButtons.remove();
        }
        
        // Create auth buttons container
        const authButtons = document.createElement('div');
        authButtons.id = 'auth-buttons';
        authButtons.className = 'ml-auto flex items-center space-x-4';
        
        if (this.currentUser) {
            // User is logged in - show profile button and logout
            const profileButton = document.createElement('a');
            profileButton.href = '/profile.html';
            profileButton.className = 'flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-200';
            profileButton.innerHTML = `
                <span class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-2">
                    ${this.currentUser.username.charAt(0).toUpperCase()}
                </span>
                <span>${this.currentUser.username}</span>
            `;
            
            const logoutButton = document.createElement('button');
            logoutButton.className = 'text-gray-700 hover:text-blue-500 transition-colors duration-200';
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', () => this.logout());
            
            authButtons.appendChild(profileButton);
            authButtons.appendChild(logoutButton);
        } else {
            // User is not logged in - show login/register buttons
            const loginButton = document.createElement('button');
            loginButton.className = 'text-gray-700 hover:text-blue-500 transition-colors duration-200';
            loginButton.textContent = 'Login';
            loginButton.addEventListener('click', () => this.showAuthModal('login'));
            
            const registerButton = document.createElement('button');
            registerButton.className = 'px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200';
            registerButton.textContent = 'Register';
            registerButton.addEventListener('click', () => this.showAuthModal('register'));
            
            authButtons.appendChild(loginButton);
            authButtons.appendChild(registerButton);
        }
        
        // Add auth buttons to header
        headerNav.appendChild(authButtons);
    },
    
    // Show the authentication modal (login or register)
    showAuthModal: function(mode = 'login') {
        // Check if modal already exists
        let modal = document.getElementById('login-modal');
        
        if (!modal) {
            // Create modal if it doesn't exist
            modal = document.createElement('div');
            modal.id = 'login-modal';
            modal.className = 'fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
                    <div class="flex justify-between items-center mb-6">
                        <h2 id="modal-title" class="text-2xl font-semibold text-gray-900">Login</h2>
                        <button id="close-modal" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div id="auth-tabs" class="flex border-b border-gray-200 mb-6">
                        <button id="login-tab" class="px-4 py-2 font-medium text-sm focus:outline-none">Login</button>
                        <button id="register-tab" class="px-4 py-2 font-medium text-sm focus:outline-none">Register</button>
                    </div>
                    
                    <!-- Login Form -->
                    <form id="login-form" class="space-y-4">
                        <div>
                            <label for="login-username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="login-username" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div>
                            <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="login-password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div id="login-error" class="text-red-500 text-sm hidden"></div>
                        <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Login</button>
                    </form>
                    
                    <!-- Register Form -->
                    <form id="register-form" class="space-y-4 hidden">
                        <div>
                            <label for="register-username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" id="register-username" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div>
                            <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="register-email" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div>
                            <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" id="register-password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div>
                            <label for="register-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" id="register-confirm-password" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                        </div>
                        <div id="register-error" class="text-red-500 text-sm hidden"></div>
                        <button type="submit" class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Register</button>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Setup event listeners for the modal
            this.setupAuthForms();
        } else {
            // Show the modal if it exists but is hidden
            modal.classList.remove('hidden');
        }
        
        // Set the active tab based on mode
        this.setActiveAuthTab(mode);
    },
    
    // Setup event listeners for authentication forms
    setupAuthForms: function() {
        const modal = document.getElementById('login-modal');
        if (!modal) return;
        
        // Close modal button
        const closeButton = document.getElementById('close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        // Tab switching
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        
        if (loginTab && registerTab) {
            loginTab.addEventListener('click', () => this.setActiveAuthTab('login'));
            registerTab.addEventListener('click', () => this.setActiveAuthTab('register'));
        }
        
        // Login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Register form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });
        }
    },
    
    // Set active authentication tab (login or register)
    setActiveAuthTab: function(mode) {
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const modalTitle = document.getElementById('modal-title');
        
        if (!loginTab || !registerTab || !loginForm || !registerForm || !modalTitle) return;
        
        if (mode === 'login') {
            // Activate login tab
            loginTab.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            registerTab.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
            
            // Show login form, hide register form
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            
            // Update modal title
            modalTitle.textContent = 'Login';
        } else {
            // Activate register tab
            registerTab.classList.add('text-blue-500', 'border-b-2', 'border-blue-500');
            loginTab.classList.remove('text-blue-500', 'border-b-2', 'border-blue-500');
            
            // Show register form, hide login form
            registerForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
            
            // Update modal title
            modalTitle.textContent = 'Register';
        }
    },
    
    // Handle login form submission
    handleLogin: function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        if (!username || !password) {
            this.showError(errorElement, 'Please enter both username and password');
            return;
        }
        
        // Get users from localStorage
        const users = this.getUsers();
        
        // Find user with matching username
        const user = users.find(u => u.username === username);
        
        if (!user) {
            this.showError(errorElement, 'Username not found');
            return;
        }
        
        // Check password
        if (user.password !== password) {
            this.showError(errorElement, 'Incorrect password');
            return;
        }
        
        // Login successful
        this.loginUser(user);
        
        // Hide modal
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    // Handle registration form submission
    handleRegistration: function() {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const errorElement = document.getElementById('register-error');
        
        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            this.showError(errorElement, 'Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError(errorElement, 'Passwords do not match');
            return;
        }
        
        // Get existing users
        const users = this.getUsers();
        
        // Check if username already exists
        if (users.some(u => u.username === username)) {
            this.showError(errorElement, 'Username already taken');
            return;
        }
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            this.showError(errorElement, 'Email already registered');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password,
            favorites: [],
            created: new Date().toISOString()
        };
        
        // Add user to storage
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Login the new user
        this.loginUser(newUser);
        
        // Hide modal
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    },
    
    // Show error message in form
    showError: function(element, message) {
        if (!element) return;
        
        element.textContent = message;
        element.classList.remove('hidden');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            element.classList.add('hidden');
        }, 3000);
    },
    
    // Login user
    loginUser: function(user) {
        // Remove password from stored user object for security
        const safeUser = { ...user };
        delete safeUser.password;
        
        // Set current user
        this.currentUser = safeUser;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        
        // Update UI
        this.updateHeaderUI();
        
        // Trigger event for other components
        const event = new CustomEvent('userLoggedIn', { detail: safeUser });
        document.dispatchEvent(event);
    },
    
    // Logout user
    logout: function() {
        // Clear current user
        this.currentUser = null;
        
        // Remove from localStorage
        localStorage.removeItem('currentUser');
        
        // Update UI
        this.updateHeaderUI();
        
        // Trigger event for other components
        const event = new CustomEvent('userLoggedOut');
        document.dispatchEvent(event);
        
        // Redirect to home page if on profile page
        if (window.location.pathname.includes('/profile.html')) {
            window.location.href = '/';
        }
    },
    
    // Get all users from localStorage
    getUsers: function() {
        const usersJson = localStorage.getItem('users');
        return usersJson ? JSON.parse(usersJson) : [];
    },
    
    // Add a game to user's favorites
    addToFavorites: function(gameId, gameTitle, gameImage, gamePlatform) {
        if (!this.currentUser) {
            // Show login modal if user is not logged in
            this.showAuthModal('login');
            return false;
        }
        
        // Get current user's full data including password
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) {
            console.error('User not found in database');
            return false;
        }
        
        const user = users[userIndex];
        
        // Check if game is already in favorites
        if (user.favorites.some(fav => fav.id === gameId)) {
            return false; // Already in favorites
        }
        
        // Add to favorites
        const favorite = {
            id: gameId,
            title: gameTitle,
            image: gameImage,
            platform: gamePlatform,
            added: new Date().toISOString()
        };
        
        user.favorites.push(favorite);
        
        // Update in localStorage
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        this.currentUser.favorites = user.favorites;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    },
    
    // Remove a game from user's favorites
    removeFromFavorites: function(gameId) {
        if (!this.currentUser) return false;
        
        // Get current user's full data including password
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex === -1) {
            console.error('User not found in database');
            return false;
        }
        
        const user = users[userIndex];
        
        // Remove from favorites
        const initialLength = user.favorites.length;
        user.favorites = user.favorites.filter(fav => fav.id !== gameId);
        
        if (user.favorites.length === initialLength) {
            return false; // Game was not in favorites
        }
        
        // Update in localStorage
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        this.currentUser.favorites = user.favorites;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        return true;
    },
    
    // Check if a game is in user's favorites
    isInFavorites: function(gameId) {
        if (!this.currentUser || !this.currentUser.favorites) return false;
        return this.currentUser.favorites.some(fav => fav.id === gameId);
    },
    
    // Get user's favorites
    getFavorites: function() {
        if (!this.currentUser) return [];
        return this.currentUser.favorites || [];
    }
};

// Initialize user system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    userSystem.init();
});