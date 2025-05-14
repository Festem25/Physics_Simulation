// API communication functions
// This file provides functions for interacting with the backend API
// For this demo, we'll use localStorage to simulate a backend

// Initialize demo data if it doesn't exist
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
});

// Initialize demo data in localStorage
function initializeData() {
    // Check if data is already initialized
    if (localStorage.getItem('initialized')) return;
    
    // Sample users
    const users = [
        {
            id: 1,
            username: 'demo',
            email: 'demo@example.com',
            password: 'password', // In real app, this would be hashed
            createdAt: new Date('2022-01-01').toISOString()
        }
    ];
    
    // Sample simulations
    const simulations = [
        {
            id: 1,
            title: 'Simple Pendulum',
            description: 'Explore the principles of simple harmonic motion with an interactive pendulum simulation.',
            type: 'pendulum',
            createdAt: new Date('2022-01-15').toISOString()
        },
        {
            id: 2,
            title: 'Wave Interference',
            description: 'Visualize constructive and destructive interference patterns with adjustable wave sources.',
            type: 'wave',
            createdAt: new Date('2022-02-10').toISOString()
        },
        {
            id: 3,
            title: 'Projectile Motion',
            description: 'Study the effects of launch angle, initial velocity, and air resistance on projectile trajectories.',
            type: 'projectile',
            createdAt: new Date('2022-03-05').toISOString()
        }
    ];
    
    // Sample resources
    const resources = [
        {
            id: 1,
            title: 'Introduction to Mechanics',
            description: 'A comprehensive guide to classical mechanics, covering Newton\'s laws, energy, and momentum.',
            type: 'Textbook',
            topic: 'Mechanics',
            url: '#',
            views: 1245,
            createdAt: new Date('2022-01-20').toISOString()
        },
        {
            id: 2,
            title: 'Electromagnetism Explained',
            description: 'Understand the principles of electricity and magnetism with clear explanations and examples.',
            type: 'Article',
            topic: 'Electromagnetism',
            url: '#',
            views: 873,
            createdAt: new Date('2022-02-15').toISOString()
        },
        {
            id: 3,
            title: 'Quantum Mechanics for Beginners',
            description: 'An accessible introduction to the fascinating world of quantum physics.',
            type: 'Video',
            topic: 'Quantum Physics',
            url: '#',
            views: 2350,
            createdAt: new Date('2022-03-10').toISOString()
        }
    ];
    
    // Sample video lessons
    const videoLessons = [
        {
            id: 1,
            title: 'Newton\'s Laws of Motion',
            description: 'Learn about the three fundamental laws that form the foundation of classical mechanics.',
            topic: 'Mechanics',
            difficulty: 'Beginner',
            duration: 1122, // seconds
            views: 2356,
            url: '#',
            createdAt: new Date('2022-01-25').toISOString()
        },
        {
            id: 2,
            title: 'Understanding Electric Fields',
            description: 'Visualize and calculate electric fields created by various charge distributions.',
            topic: 'Electromagnetism',
            difficulty: 'Intermediate',
            duration: 1455, // seconds
            views: 1587,
            url: '#',
            createdAt: new Date('2022-02-20').toISOString()
        },
        {
            id: 3,
            title: 'Special Relativity: Time Dilation',
            description: 'Explore how time passes differently for objects moving at different velocities.',
            topic: 'Modern Physics',
            difficulty: 'Advanced',
            duration: 1928, // seconds
            views: 983,
            url: '#',
            createdAt: new Date('2022-03-15').toISOString()
        }
    ];
    
    // Sample questions
    const questions = [
        {
            id: 1,
            title: 'Why does a pendulum\'s period not depend on its mass?',
            content: 'I\'m confused about why the mass of a pendulum doesn\'t affect its period. Can someone explain the physics behind this?',
            author: 'curious_student',
            status: 'answered',
            votes: 15,
            tags: ['mechanics', 'pendulum', 'oscillation'],
            createdAt: new Date('2022-04-05').toISOString()
        },
        {
            id: 2,
            title: 'How do I calculate the electric field of a charged ring?',
            content: 'I need to find the electric field along the axis of a uniformly charged ring. What\'s the approach for solving this problem?',
            author: 'physics_major',
            status: 'pending',
            votes: 8,
            tags: ['electromagnetism', 'electric-field'],
            createdAt: new Date('2022-04-10').toISOString()
        },
        {
            id: 3,
            title: 'Trouble understanding quantum tunneling',
            content: 'Can someone explain quantum tunneling in simple terms? Why is it possible for particles to pass through energy barriers?',
            author: 'quantum_novice',
            status: 'pending',
            votes: 12,
            tags: ['quantum', 'tunneling', 'wave-function'],
            createdAt: new Date('2022-04-15').toISOString()
        }
    ];
    
    // Store data in localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('simulations', JSON.stringify(simulations));
    localStorage.setItem('resources', JSON.stringify(resources));
    localStorage.setItem('videoLessons', JSON.stringify(videoLessons));
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('savedResources', JSON.stringify([]));
    
    // Mark as initialized
    localStorage.setItem('initialized', 'true');
}

// API functions

// Get simulations
async function getSimulations() {
    return new Promise((resolve, reject) => {
        try {
            const simulations = JSON.parse(localStorage.getItem('simulations') || '[]');
            resolve(simulations);
        } catch (error) {
            reject(error);
        }
    });
}

// Get resources
async function getResources() {
    return new Promise((resolve, reject) => {
        try {
            const resources = JSON.parse(localStorage.getItem('resources') || '[]');
            resolve(resources);
        } catch (error) {
            reject(error);
        }
    });
}

// Get video lessons
async function getVideoLessons() {
    return new Promise((resolve, reject) => {
        try {
            const videoLessons = JSON.parse(localStorage.getItem('videoLessons') || '[]');
            resolve(videoLessons);
        } catch (error) {
            reject(error);
        }
    });
}

// Get questions
async function getQuestions() {
    return new Promise((resolve, reject) => {
        try {
            const questions = JSON.parse(localStorage.getItem('questions') || '[]');
            resolve(questions);
        } catch (error) {
            reject(error);
        }
    });
}

// Get saved resources
async function getSavedResources(userId) {
    return new Promise((resolve, reject) => {
        try {
            const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
            const userSavedResources = savedResources.filter(sr => sr.userId === userId);
            
            // Get full resource details
            const resources = JSON.parse(localStorage.getItem('resources') || '[]');
            const userResources = userSavedResources.map(sr => {
                const resource = resources.find(r => r.id === sr.resourceId);
                return {
                    ...resource,
                    savedId: sr.id
                };
            });
            
            resolve(userResources);
        } catch (error) {
            reject(error);
        }
    });
}

// Save a resource
async function saveResource(userId, resourceId) {
    return new Promise((resolve, reject) => {
        try {
            const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
            
            // Check if already saved
            if (savedResources.some(sr => sr.userId === userId && sr.resourceId === resourceId)) {
                throw new Error('Resource already saved');
            }
            
            // Create new saved resource
            const newSavedResource = {
                id: Date.now(),
                userId,
                resourceId,
                createdAt: new Date().toISOString()
            };
            
            // Add to storage
            savedResources.push(newSavedResource);
            localStorage.setItem('savedResources', JSON.stringify(savedResources));
            
            resolve(newSavedResource);
        } catch (error) {
            reject(error);
        }
    });
}

// Remove a saved resource
async function removeSavedResource(savedId) {
    return new Promise((resolve, reject) => {
        try {
            const savedResources = JSON.parse(localStorage.getItem('savedResources') || '[]');
            
            // Filter out the resource to remove
            const updatedSavedResources = savedResources.filter(sr => sr.id !== parseInt(savedId));
            
            // Update storage
            localStorage.setItem('savedResources', JSON.stringify(updatedSavedResources));
            
            resolve({ success: true });
        } catch (error) {
            reject(error);
        }
    });
}

// Subscribe to newsletter
async function subscribeToNewsletter(email) {
    return new Promise((resolve, reject) => {
        try {
            // In a real app, this would send the email to a backend
            // For this demo, we'll just store it in localStorage
            const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
            
            // Check if already subscribed
            if (subscribers.includes(email)) {
                throw new Error('Already subscribed');
            }
            
            // Add to subscribers
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            
            resolve({ success: true });
        } catch (error) {
            reject(error);
        }
    });
}
