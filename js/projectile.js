// Projectile motion simulation

let projectileCanvas, projectileCtx;
let projectileRunning = false;
let projectiles = [];
let gravity = 9.8;
let airResistance = 0.02;
let projectileInterval;

// Projectile class
class Projectile {
    constructor(x, y, velocity, angle) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.velocity = velocity;
        this.angle = angle * Math.PI / 180; // Convert to radians
        this.vx = velocity * Math.cos(this.angle);
        this.vy = velocity * Math.sin(this.angle);
        this.radius = 8;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.trail = [];
        this.maxTrailLength = 50;
        this.active = true;
        this.time = 0;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        this.time += deltaTime;
        
        // Add current position to trail
        if (this.trail.length >= this.maxTrailLength) {
            this.trail.shift();
        }
        this.trail.push({ x: this.x, y: this.y });
        
        // Apply air resistance
        this.vx *= (1 - airResistance * deltaTime);
        this.vy *= (1 - airResistance * deltaTime);
        
        // Apply gravity
        this.vy -= gravity * deltaTime;
        
        // Update position
        this.x += this.vx * deltaTime * 50;
        this.y -= this.vy * deltaTime * 50;
        
        // Check for floor collision
        if (this.y >= projectileCanvas.height - this.radius) {
            this.y = projectileCanvas.height - this.radius;
            
            // Bounce with energy loss
            this.vy = -this.vy * 0.6;
            
            // Stop if moving too slowly
            if (Math.abs(this.vy) < 0.5) {
                this.active = false;
            }
        }
        
        // Check for wall collision
        if (this.x < this.radius || this.x > projectileCanvas.width - this.radius) {
            this.vx = -this.vx * 0.8;
            this.x = this.x < this.radius ? this.radius : projectileCanvas.width - this.radius;
        }
    }
    
    draw() {
        // Draw trail
        if (this.trail.length > 1) {
            projectileCtx.beginPath();
            projectileCtx.moveTo(this.trail[0].x, this.trail[0].y);
            
            for (let i = 1; i < this.trail.length; i++) {
                projectileCtx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            
            projectileCtx.strokeStyle = this.color;
            projectileCtx.lineWidth = 2;
            projectileCtx.stroke();
        }
        
        // Draw projectile
        projectileCtx.beginPath();
        projectileCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        projectileCtx.fillStyle = this.color;
        projectileCtx.fill();
    }
}

// Function to initialize the projectile simulation
function initProjectileSimulation() {
    const projectileContainer = document.querySelector('.projectile-container');
    if (!projectileContainer) return;
    
    // Create canvas
    projectileCanvas = document.createElement('canvas');
    projectileCanvas.width = projectileContainer.offsetWidth;
    projectileCanvas.height = projectileContainer.offsetHeight || 400;
    projectileContainer.appendChild(projectileCanvas);
    
    // Get context
    projectileCtx = projectileCanvas.getContext('2d');
    
    // Add initial projectile
    launchProjectile(60, 10);
    
    // Set up controls (if they exist)
    const launchButton = document.getElementById('projectile-launch');
    const angleInput = document.getElementById('projectile-angle');
    const velocityInput = document.getElementById('projectile-velocity');
    const gravityInput = document.getElementById('projectile-gravity');
    const resistanceInput = document.getElementById('projectile-resistance');
    
    if (launchButton) {
        launchButton.addEventListener('click', function() {
            const angle = angleInput ? parseFloat(angleInput.value) : 45;
            const velocity = velocityInput ? parseFloat(velocityInput.value) : 10;
            
            launchProjectile(angle, velocity);
        });
    }
    
    if (gravityInput) {
        gravityInput.addEventListener('input', function() {
            gravity = parseFloat(this.value);
            document.getElementById('gravity-value').textContent = gravity.toFixed(1) + ' m/s²';
        });
    }
    
    if (resistanceInput) {
        resistanceInput.addEventListener('input', function() {
            airResistance = parseFloat(this.value);
            document.getElementById('resistance-value').textContent = 
                (airResistance * 100).toFixed(1) + '%';
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (!projectileCanvas) return;
        projectileCanvas.width = projectileContainer.offsetWidth;
        projectileCanvas.height = projectileContainer.offsetHeight || 400;
    });
    
    // Start animation
    startProjectileSimulation();
}

function launchProjectile(angle, velocity) {
    // Create new projectile
    const projectile = new Projectile(
        50, // x position (left side)
        projectileCanvas.height - 30, // y position (bottom)
        velocity,
        angle
    );
    
    // Add to projectiles array
    projectiles.push(projectile);
    
    // Remove old projectiles if there are too many
    if (projectiles.length > 5) {
        projectiles.shift();
    }
}

function startProjectileSimulation() {
    if (projectileRunning) return;
    
    projectileRunning = true;
    let lastTime = performance.now();
    
    function animate() {
        if (!projectileRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // in seconds
        lastTime = currentTime;
        
        // Clear canvas
        projectileCtx.clearRect(0, 0, projectileCanvas.width, projectileCanvas.height);
        
        // Draw background elements
        drawProjectileBackground();
        
        // Update and draw projectiles
        projectiles.forEach(projectile => {
            projectile.update(deltaTime);
            projectile.draw();
        });
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    animate();
}

function drawProjectileBackground() {
    // Draw ground
    projectileCtx.fillStyle = '#1f2937';
    projectileCtx.fillRect(0, projectileCanvas.height - 10, projectileCanvas.width, 10);
    
    // Draw launch point
    projectileCtx.beginPath();
    projectileCtx.arc(50, projectileCanvas.height - 30, 5, 0, Math.PI * 2);
    projectileCtx.fillStyle = '#fff';
    projectileCtx.fill();
    
    // Draw distance markings
    projectileCtx.fillStyle = '#6b7280';
    projectileCtx.font = '12px Arial';
    
    for (let i = 0; i <= 10; i++) {
        const x = i * projectileCanvas.width / 10;
        const distance = i * 10;
        
        projectileCtx.fillText(`${distance}m`, x, projectileCanvas.height - 15);
        
        if (i > 0) {
            projectileCtx.beginPath();
            projectileCtx.moveTo(x, projectileCanvas.height - 10);
            projectileCtx.lineTo(x, projectileCanvas.height - 5);
            projectileCtx.strokeStyle = '#6b7280';
            projectileCtx.stroke();
        }
    }
}

// Initialize projectile simulation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the simulations page with the projectile container
    if (document.querySelector('.projectile-container')) {
        initProjectileSimulation();
    }
});