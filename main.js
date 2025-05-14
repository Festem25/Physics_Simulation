// Main JavaScript file for common functionality

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add header content
    insertHeader();
    
    // Add footer content
    insertFooter();
    
    // Set up authentication modals
    setupAuthModals();
    
    // Add event listeners for tabs on simulation page
    setupTabs();
    
    // Load dynamic content based on the current page
    loadPageSpecificContent();
});

// Insert header content dynamically
function insertHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    header.innerHTML = `
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="${getBasePath()}index.html">PhysicsHub</a>
                </div>
                <nav class="main-nav">
                    <ul>
                        <li><a href="${getBasePath()}pages/simulations.html">Simulations</a></li>
                        <li><a href="${getBasePath()}pages/teaching.html">Teaching</a></li>
                        <li><a href="${getBasePath()}pages/resources.html">Resources</a></li>
                        <li><a href="${getBasePath()}pages/questions.html">Ask a Question</a></li>
                        <li><a href="${getBasePath()}pages/donate.html">Donate</a></li>
                    </ul>
                </nav>
                <div class="header-actions">
                    <div class="search-box">
                        <input type="text" placeholder="Search...">
                        <button class="search-button">🔍</button>
                    </div>
                    <div class="auth-buttons" id="auth-buttons">
                        <button id="login-button" class="button button-small">Sign In</button>
                        <button id="register-button" class="button button-small button-outline">Register</button>
                    </div>
                    <div class="user-menu" id="user-menu" style="display: none;">
                        <button id="user-button" class="user-button">
                            <span class="user-initial">U</span>
                        </button>
                        <div class="user-dropdown">
                            <a href="${getBasePath()}pages/profile.html">My Profile</a>
                            <a href="#" id="logout-button">Sign Out</a>
                        </div>
                    </div>
                    <button class="mobile-menu-button" id="mobile-menu-button">☰</button>
                </div>
            </div>
            <div class="mobile-nav" id="mobile-nav">
                <ul>
                    <li><a href="${getBasePath()}pages/simulations.html">Simulations</a></li>
                    <li><a href="${getBasePath()}pages/teaching.html">Teaching</a></li>
                    <li><a href="${getBasePath()}pages/resources.html">Resources</a></li>
                    <li><a href="${getBasePath()}pages/questions.html">Ask a Question</a></li>
                    <li><a href="${getBasePath()}pages/donate.html">Donate</a></li>
                </ul>
            </div>
        </div>
    `;
    
    // Set up mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuButton && mobileNav) {
        mobileMenuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
        });
    }
    
    // Set up user dropdown
    const userButton = document.getElementById('user-button');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userButton && userDropdown) {
        userButton.addEventListener('click', function() {
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Update auth section based on login status
    updateAuthDisplay();
}

// Insert footer content dynamically
function insertFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    
    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <h2>PhysicsHub</h2>
                    <p>Making physics education accessible and engaging for everyone.</p>
                </div>
                
                <div class="footer-links">
                    <div class="footer-section">
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="${getBasePath()}pages/simulations.html">Simulations</a></li>
                            <li><a href="${getBasePath()}pages/teaching.html">Teaching Materials</a></li>
                            <li><a href="${getBasePath()}pages/resources.html">Educational Resources</a></li>
                            <li><a href="${getBasePath()}pages/questions.html">Q&A Forum</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>About Us</h3>
                        <ul>
                            <li><a href="#">Our Mission</a></li>
                            <li><a href="#">Team</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div class="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="${getBasePath()}pages/donate.html">Donate</a></li>
                            <li><a href="#">Volunteer</a></li>
                            <li><a href="#">Partnerships</a></li>
                            <li><a href="#">Report Issues</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} PhysicsHub. All rights reserved.</p>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook">Facebook</a>
                    <a href="#" aria-label="Twitter">Twitter</a>
                    <a href="#" aria-label="YouTube">YouTube</a>
                    <a href="#" aria-label="GitHub">GitHub</a>
                </div>
            </div>
        </div>
    `;
}

// Set up authentication modals
function setupAuthModals() {
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeBtns = document.querySelectorAll('.close');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    // Setup login button
    if (loginButton && loginModal) {
        loginButton.addEventListener('click', function() {
            loginModal.style.display = 'block';
        });
    }
    
    // Setup register button
    if (registerButton && registerModal) {
        registerButton.addEventListener('click', function() {
            registerModal.style.display = 'block';
        });
    }
    
    // Setup close buttons
    if (closeBtns) {
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (loginModal) loginModal.style.display = 'none';
                if (registerModal) registerModal.style.display = 'none';
            });
        });
    }
    
    // Switch between login and register
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'block';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'block';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (loginModal && e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (registerModal && e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Handle form submissions
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Call login function from auth.js
            if (typeof login === 'function') {
                login(username, password)
                    .then(() => {
                        if (loginModal) loginModal.style.display = 'none';
                        updateAuthDisplay();
                    })
                    .catch(err => {
                        alert('Login failed: ' + err.message);
                    });
            } else {
                console.error('Login function not available');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            
            // Call register function from auth.js
            if (typeof register === 'function') {
                register(username, email, password)
                    .then(() => {
                        if (registerModal) registerModal.style.display = 'none';
                        updateAuthDisplay();
                    })
                    .catch(err => {
                        alert('Registration failed: ' + err.message);
                    });
            } else {
                console.error('Register function not available');
            }
        });
    }
    
    // Setup logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof logout === 'function') {
                logout();
                updateAuthDisplay();
            } else {
                console.error('Logout function not available');
            }
        });
    }
}

// Update auth display based on login status
function updateAuthDisplay() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userInitial = document.querySelector('.user-initial');
    
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    
    if (user) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userInitial) userInitial.textContent = user.username.charAt(0).toUpperCase();
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Set up tabs on simulation page
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            const content = document.getElementById(`${tabId}-tab`);
            if (content) content.classList.add('active');
        });
    });
}

// Load page specific content
function loadPageSpecificContent() {
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === '/') {
        // Home page
        loadFeaturedSimulations();
        setupNewsletterForm();
    } else if (currentPage === 'simulations.html') {
        // Simulations page
        loadAllSimulations();
    } else if (currentPage === 'resources.html') {
        // Resources page
        loadResources();
    } else if (currentPage === 'teaching.html') {
        // Teaching page
        loadVideoLessons();
    } else if (currentPage === 'questions.html') {
        // Questions page
        loadQuestions();
    } else if (currentPage === 'profile.html') {
        // Profile page
        loadUserProfile();
    }
}

// Helper function to get correct base path
function getBasePath() {
    // If we're in a subdirectory (pages/), go up one level
    if (window.location.pathname.includes('/pages/')) {
        return '../';
    }
    // Otherwise, we're at the root
    return '';
}

// Example function to load featured simulations
function loadFeaturedSimulations() {
    const simulationCardsContainer = document.getElementById('simulation-cards');
    if (!simulationCardsContainer) return;
    
    // In a real app, this would fetch data from an API
    // For now, we'll use sample data
    const featuredSimulations = [
        {
            id: 1,
            title: 'Simple Pendulum',
            description: 'Explore the principles of simple harmonic motion with an interactive pendulum simulation.',
            type: 'pendulum'
        },
        {
            id: 2,
            title: 'Wave Interference',
            description: 'Visualize constructive and destructive interference patterns with adjustable wave sources.',
            type: 'wave'
        },
        {
            id: 3,
            title: 'Projectile Motion',
            description: 'Study the effects of launch angle, initial velocity, and air resistance on projectile trajectories.',
            type: 'projectile'
        }
    ];
    
    // Create HTML
    const simulationsHTML = featuredSimulations.map(simulation => `
        <div class="simulation-card">
            <div class="simulation-preview">
                <div class="placeholder-preview"></div>
            </div>
            <div class="simulation-info">
                <h3>${simulation.title}</h3>
                <p>${simulation.description}</p>
                <a href="pages/simulations.html?id=${simulation.id}" class="button button-outline">Launch Simulation</a>
            </div>
        </div>
    `).join('');
    
    simulationCardsContainer.innerHTML = simulationsHTML;
}

// Setup newsletter form
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[name="email"]').value;
        
        // In a real app, this would send the email to a server
        // For now, we'll just show a success message
        if (newsletterMessage) {
            newsletterMessage.textContent = 'Thank you for subscribing to our newsletter!';
            newsletterMessage.style.color = '#4CAF50';
        }
        
        // Clear form
        newsletterForm.reset();
    });
}

// Load all simulations
function loadAllSimulations() {
    const simulationGrid = document.getElementById('simulation-grid');
    if (!simulationGrid) return;
    
    // In a real app, this would fetch data from an API
    // For now, we'll use sample data
    const simulations = [
        {
            id: 1,
            title: 'Simple Pendulum',
            description: 'Explore the principles of simple harmonic motion with an interactive pendulum simulation.',
            type: 'pendulum'
        },
        {
            id: 2,
            title: 'Wave Interference',
            description: 'Visualize constructive and destructive interference patterns with adjustable wave sources.',
            type: 'wave'
        },
        {
            id: 3,
            title: 'Projectile Motion',
            description: 'Study the effects of launch angle, initial velocity, and air resistance on projectile trajectories.',
            type: 'projectile'
        },
        {
            id: 4,
            title: 'Electric Field Simulator',
            description: 'Visualize electric fields created by multiple charges and understand field strength and direction.',
            type: 'electric'
        }
    ];
    
    // Create HTML
    const simulationsHTML = simulations.map(simulation => `
        <div class="simulation-card">
            <div class="simulation-preview">
                <div class="placeholder-preview"></div>
            </div>
            <div class="simulation-info">
                <h3>${simulation.title}</h3>
                <p>${simulation.description}</p>
                <a href="simulations.html?id=${simulation.id}" class="button button-outline">Launch Simulation</a>
            </div>
        </div>
    `).join('');
    
    simulationGrid.innerHTML = simulationsHTML;
}

// Load resources
function loadResources() {
    const resourcesGrid = document.getElementById('resources-grid');
    if (!resourcesGrid) return;
    
    // In a real app, this would fetch data from an API
    // For now, we'll use sample data
    const resources = [
        {
            id: 1,
            title: 'Introduction to Mechanics',
            description: 'A comprehensive guide to classical mechanics, covering Newton\'s laws, energy, and momentum.',
            type: 'Textbook',
            topic: 'Mechanics',
            url: '#',
            views: 1245
        },
        {
            id: 2,
            title: 'Electromagnetism Explained',
            description: 'Understand the principles of electricity and magnetism with clear explanations and examples.',
            type: 'Article',
            topic: 'Electromagnetism',
            url: '#',
            views: 873
        },
        {
            id: 3,
            title: 'Quantum Mechanics for Beginners',
            description: 'An accessible introduction to the fascinating world of quantum physics.',
            type: 'Video',
            topic: 'Quantum Physics',
            url: '#',
            views: 2350
        }
    ];
    
    // Create HTML
    const resourcesHTML = resources.map(resource => `
        <div class="resource-card">
            <div class="resource-thumbnail">
                <div class="placeholder-thumbnail">
                    <span class="resource-type">${resource.type}</span>
                </div>
            </div>
            <div class="resource-content">
                <h3>${resource.title}</h3>
                <p class="resource-info">
                    <span class="resource-topic">${resource.topic}</span>
                    <span class="resource-views">${resource.views} views</span>
                </p>
                <p>${resource.description}</p>
                <a href="${resource.url}" class="button button-small" target="_blank">View Resource</a>
            </div>
        </div>
    `).join('');
    
    resourcesGrid.innerHTML = resourcesHTML;
}

// Load video lessons
function loadVideoLessons() {
    const videoGrid = document.getElementById('video-grid');
    if (!videoGrid) return;
    
    // In a real app, this would fetch data from an API
    // For now, we'll use sample data
    const videos = [
        {
            id: 1,
            title: 'Newton\'s Laws of Motion',
            description: 'Learn about the three fundamental laws that form the foundation of classical mechanics.',
            topic: 'Mechanics',
            difficulty: 'Beginner',
            duration: 1122, // seconds
            views: 2356,
            url: '#'
        },
        {
            id: 2,
            title: 'Understanding Electric Fields',
            description: 'Visualize and calculate electric fields created by various charge distributions.',
            topic: 'Electromagnetism',
            difficulty: 'Intermediate',
            duration: 1455, // seconds
            views: 1587,
            url: '#'
        },
        {
            id: 3,
            title: 'Special Relativity: Time Dilation',
            description: 'Explore how time passes differently for objects moving at different velocities.',
            topic: 'Modern Physics',
            difficulty: 'Advanced',
            duration: 1928, // seconds
            views: 983,
            url: '#'
        }
    ];
    
    // Create HTML
    const videosHTML = videos.map(video => `
        <div class="video-card">
            <div class="video-thumbnail">
                <div class="placeholder-thumbnail">
                    <span class="duration">${formatDuration(video.duration)}</span>
                </div>
            </div>
            <div class="video-content">
                <h3>${video.title}</h3>
                <p class="video-info">
                    <span class="video-topic">${video.topic}</span>
                    <span class="video-difficulty">${video.difficulty}</span>
                    <span class="video-views">${video.views} views</span>
                </p>
                <p class="video-description">${video.description}</p>
            </div>
        </div>
    `).join('');
    
    videoGrid.innerHTML = videosHTML;
}

// Format video duration from seconds to mm:ss
function formatDuration(seconds) {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Load questions
function loadQuestions() {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;
    
    // In a real app, this would fetch data from an API
    // For now, we'll use sample data
    const questions = [
        {
            id: 1,
            title: 'Why does a pendulum\'s period not depend on its mass?',
            content: 'I\'m confused about why the mass of a pendulum doesn\'t affect its period. Can someone explain the physics behind this?',
            author: 'curious_student',
            status: 'answered',
            votes: 15,
            tags: ['mechanics', 'pendulum', 'oscillation'],
            createdAt: '2022-04-05T12:00:00Z'
        },
        {
            id: 2,
            title: 'How do I calculate the electric field of a charged ring?',
            content: 'I need to find the electric field along the axis of a uniformly charged ring. What\'s the approach for solving this problem?',
            author: 'physics_major',
            status: 'pending',
            votes: 8,
            tags: ['electromagnetism', 'electric-field'],
            createdAt: '2022-04-10T14:30:00Z'
        },
        {
            id: 3,
            title: 'Trouble understanding quantum tunneling',
            content: 'Can someone explain quantum tunneling in simple terms? Why is it possible for particles to pass through energy barriers?',
            author: 'quantum_novice',
            status: 'pending',
            votes: 12,
            tags: ['quantum', 'tunneling', 'wave-function'],
            createdAt: '2022-04-15T09:15:00Z'
        }
    ];
    
    // Create HTML
    const questionsHTML = questions.map(question => `
        <div class="question-card">
            <div class="question-votes">
                <button class="vote-button up">▲</button>
                <span class="vote-count">${question.votes || 0}</span>
                <button class="vote-button down">▼</button>
            </div>
            <div class="question-content">
                <h3><a href="questions.html?id=${question.id}">${question.title}</a></h3>
                <p>${question.content}</p>
                <div class="question-meta">
                    <span class="question-author">Asked by ${question.author}</span>
                    <span class="question-date">${formatDate(question.createdAt)}</span>
                    <span class="question-status ${question.status}">${question.status}</span>
                </div>
                <div class="question-tags">
                    ${question.tags ? question.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    questionsContainer.innerHTML = questionsHTML;
}

// Format date to readable string
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Load user profile
function loadUserProfile() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user) {
        // Redirect to home if not logged in
        window.location.href = getBasePath() + 'index.html';
        return;
    }
    
    // Update profile info
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    
    if (profileUsername) profileUsername.textContent = user.username;
    if (profileEmail) profileEmail.textContent = user.email;
    
    // Load saved resources
    const savedResourcesContainer = document.getElementById('saved-resources');
    if (savedResourcesContainer) {
        // In a real app, this would fetch data from an API
        // For now, we'll use sample data
        const savedResources = [
            {
                id: 1,
                title: 'Introduction to Mechanics',
                description: 'A comprehensive guide to classical mechanics, covering Newton\'s laws, energy, and momentum.',
                type: 'Textbook',
                url: '#'
            }
        ];
        
        if (savedResources.length === 0) {
            savedResourcesContainer.innerHTML = '<p>You have not saved any resources yet.</p>';
            return;
        }
        
        const resourcesHTML = savedResources.map(resource => `
            <div class="resource-card">
                <div class="resource-thumbnail">
                    <div class="placeholder-thumbnail">
                        <span class="resource-type">${resource.type}</span>
                    </div>
                </div>
                <div class="resource-content">
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <div class="resource-actions">
                        <a href="${resource.url}" class="button button-small" target="_blank">View Resource</a>
                        <button class="button button-small button-danger remove-saved" data-id="${resource.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        savedResourcesContainer.innerHTML = resourcesHTML;
        
        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-saved').forEach(button => {
            button.addEventListener('click', function() {
                const resourceId = this.getAttribute('data-id');
                // In a real app, this would make an API request to remove the resource
                // For now, we'll just remove it from the DOM
                this.closest('.resource-card').remove();
                
                // Show message if no resources left
                if (savedResourcesContainer.children.length === 0) {
                    savedResourcesContainer.innerHTML = '<p>You have not saved any resources yet.</p>';
                }
            });
        });
    }
}