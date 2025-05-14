// Authentication related functions

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

// Get current user
function getCurrentUser() {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
}

// Login function
async function login(username, password) {
    try {
        // In a real application, you would make an API request here
        // For this demo, we'll simulate a login
        
        // Get users from localStorage or initialize
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user
        const user = users.find(u => 
            u.username === username && u.password === password
        );
        
        if (!user) {
            throw new Error('Invalid username or password');
        }
        
        // Store user in localStorage (except password)
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        return userWithoutPassword;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Register function
async function register(username, email, password) {
    try {
        // In a real application, you would make an API request here
        // For this demo, we'll simulate a registration
        
        // Get users from localStorage or initialize
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if username or email already exists
        if (users.some(u => u.username === username)) {
            throw new Error('Username already exists');
        }
        
        if (users.some(u => u.email === email)) {
            throw new Error('Email already exists');
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            username,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        // Add to users
        users.push(newUser);
        
        // Save users
        localStorage.setItem('users', JSON.stringify(users));
        
        // Login the user
        return login(username, password);
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('user');
}