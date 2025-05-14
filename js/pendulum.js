// Global variables for the pendulum simulation
let pendulumCanvas, pendulumCtx;
let pendulumLength = 200;
let pendulumGravity = 9.8;
let pendulumDamping = 0.995;
let pendulumAngle = Math.PI / 4; // Initial angle (45 degrees)
let pendulumAngleVelocity = 0;
let pendulumAngleAcceleration = 0;
let pendulumOriginX, pendulumOriginY;
let pendulumBobX, pendulumBobY;
let pendulumRunning = true;
let pendulumDragging = false;
let pendulumLastTimestamp = 0;

// Function to initialize the pendulum simulation
function initPendulumSimulation() {
    // Get the container
    const pendulumContainer = document.querySelector('.pendulum-container');
    if (!pendulumContainer) return;
    
    // Create canvas
    pendulumCanvas = document.createElement('canvas');
    pendulumCanvas.width = pendulumContainer.offsetWidth;
    pendulumCanvas.height = pendulumContainer.offsetHeight || 400;
    pendulumContainer.appendChild(pendulumCanvas);
    
    // Get context
    pendulumCtx = pendulumCanvas.getContext('2d');
    
    // Set initial position
    updatePendulumPositions();
    
    // Add event listeners for interaction
    pendulumCanvas.addEventListener('mousedown', startPendulumDrag);
    pendulumCanvas.addEventListener('mousemove', dragPendulum);
    pendulumCanvas.addEventListener('mouseup', endPendulumDrag);
    pendulumCanvas.addEventListener('mouseleave', endPendulumDrag);
    pendulumCanvas.addEventListener('touchstart', handlePendulumTouch);
    pendulumCanvas.addEventListener('touchmove', handlePendulumTouch);
    pendulumCanvas.addEventListener('touchend', endPendulumDrag);
    
    // Set up control listeners
    const lengthSlider = document.getElementById('length-slider');
    const gravitySlider = document.getElementById('gravity-slider');
    const dampingSlider = document.getElementById('damping-slider');
    const resetButton = document.getElementById('pendulum-reset');
    const pauseButton = document.getElementById('pendulum-pause');
    
    if (lengthSlider) {
        lengthSlider.addEventListener('input', function() {
            pendulumLength = parseInt(this.value);
            const lengthValueElement = document.getElementById('length-value');
            if (lengthValueElement) {
                lengthValueElement.textContent = `${pendulumLength} cm`;
            }
            updatePendulumPositions();
        });
    }
    
    if (gravitySlider) {
        gravitySlider.addEventListener('input', function() {
            pendulumGravity = parseFloat(this.value);
            const gravityValueElement = document.getElementById('gravity-value');
            if (gravityValueElement) {
                gravityValueElement.textContent = `${pendulumGravity.toFixed(1)} m/s²`;
            }
        });
    }
    
    if (dampingSlider) {
        dampingSlider.addEventListener('input', function() {
            pendulumDamping = parseFloat(this.value);
            const dampingValueElement = document.getElementById('damping-value');
            if (dampingValueElement) {
                const dampingPercent = ((1 - pendulumDamping) * 1000).toFixed(1);
                dampingValueElement.textContent = `${dampingPercent}%`;
            }
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetPendulum);
    }
    
    if (pauseButton) {
        pauseButton.addEventListener('click', function() {
            pendulumRunning = !pendulumRunning;
            this.textContent = pendulumRunning ? 'Pause' : 'Play';
            
            if (pendulumRunning) {
                pendulumLastTimestamp = performance.now();
                requestAnimationFrame(animatePendulum);
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (pendulumCanvas) {
            pendulumCanvas.width = pendulumContainer.offsetWidth;
            pendulumCanvas.height = pendulumContainer.offsetHeight || 400;
            updatePendulumPositions();
        }
    });
    
    // Start animation
    pendulumLastTimestamp = performance.now();
    requestAnimationFrame(animatePendulum);
}

function updatePendulumPositions() {
    if (!pendulumCanvas) return;
    
    pendulumOriginX = pendulumCanvas.width / 2;
    pendulumOriginY = pendulumCanvas.height * 0.2;
    
    pendulumBobX = pendulumOriginX + Math.sin(pendulumAngle) * pendulumLength;
    pendulumBobY = pendulumOriginY + Math.cos(pendulumAngle) * pendulumLength;
}

function animatePendulum(timestamp) {
    if (!pendulumRunning || !pendulumCtx) {
        requestAnimationFrame(animatePendulum);
        return;
    }
    
    // Calculate delta time
    const deltaTime = (timestamp - pendulumLastTimestamp) / 1000; // in seconds
    pendulumLastTimestamp = timestamp;
    
    // Clear canvas
    pendulumCtx.clearRect(0, 0, pendulumCanvas.width, pendulumCanvas.height);
    
    // If dragging, update angle based on mouse position
    if (!pendulumDragging) {
        // Calculate acceleration (increase factor for faster motion)
        // Multiplying by 10 to make it MUCH faster
        pendulumAngleAcceleration = -pendulumGravity / pendulumLength * Math.sin(pendulumAngle) * 10;
        
        // Apply acceleration to velocity
        pendulumAngleVelocity += pendulumAngleAcceleration * deltaTime;
        
        // Apply damping
        pendulumAngleVelocity *= pendulumDamping;
        
        // Apply velocity to angle
        pendulumAngle += pendulumAngleVelocity * deltaTime;
    }
    
    // Update positions
    updatePendulumPositions();
    
    // Draw pendulum
    drawPendulum();
    
    // Request next frame
    requestAnimationFrame(animatePendulum);
}

function drawPendulum() {
    if (!pendulumCtx) return;
    
    // Draw blue background
    pendulumCtx.fillStyle = '#111827';
    pendulumCtx.fillRect(0, 0, pendulumCanvas.width, pendulumCanvas.height);
    
    // Draw string
    pendulumCtx.beginPath();
    pendulumCtx.moveTo(pendulumOriginX, pendulumOriginY);
    pendulumCtx.lineTo(pendulumBobX, pendulumBobY);
    pendulumCtx.strokeStyle = '#6b7280';
    pendulumCtx.lineWidth = 2;
    pendulumCtx.stroke();
    
    // Draw pivot
    pendulumCtx.beginPath();
    pendulumCtx.arc(pendulumOriginX, pendulumOriginY, 5, 0, Math.PI * 2);
    pendulumCtx.fillStyle = '#1f2937';
    pendulumCtx.fill();
    
    // Draw bob
    pendulumCtx.beginPath();
    pendulumCtx.arc(pendulumBobX, pendulumBobY, 20, 0, Math.PI * 2);
    
    // Create gradient for 3D effect
    const gradient = pendulumCtx.createRadialGradient(
        pendulumBobX - 5, pendulumBobY - 5, 0,
        pendulumBobX, pendulumBobY, 20
    );
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#1d4ed8');
    
    pendulumCtx.fillStyle = gradient;
    pendulumCtx.fill();
    
    pendulumCtx.strokeStyle = '#1e40af';
    pendulumCtx.lineWidth = 1;
    pendulumCtx.stroke();
    
    // Add highlight
    pendulumCtx.beginPath();
    pendulumCtx.arc(pendulumBobX - 7, pendulumBobY - 7, 5, 0, Math.PI * 2);
    pendulumCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    pendulumCtx.fill();
}

function startPendulumDrag(e) {
    if (!pendulumCanvas) return;
    
    const rect = pendulumCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if mouse is near the bob
    const dx = mouseX - pendulumBobX;
    const dy = mouseY - pendulumBobY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 30) {
        pendulumDragging = true;
        pendulumRunning = true;
        pendulumAngleVelocity = 0;
        
        // Update angle based on mouse position
        pendulumAngle = Math.atan2(mouseX - pendulumOriginX, mouseY - pendulumOriginY);
        updatePendulumPositions();
    }
}

function dragPendulum(e) {
    if (!pendulumDragging || !pendulumCanvas) return;
    
    const rect = pendulumCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Update angle based on mouse position
    pendulumAngle = Math.atan2(mouseX - pendulumOriginX, mouseY - pendulumOriginY);
    updatePendulumPositions();
}

function endPendulumDrag() {
    pendulumDragging = false;
}

function handlePendulumTouch(e) {
    if (!e) return;
    
    e.preventDefault();
    
    if (e.type === 'touchstart') {
        const touch = e.touches[0];
        startPendulumDrag({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    } else if (e.type === 'touchmove' && pendulumDragging) {
        const touch = e.touches[0];
        dragPendulum({
            clientX: touch.clientX,
            clientY: touch.clientY
        });
    }
}

function resetPendulum() {
    pendulumAngle = Math.PI / 4;
    pendulumAngleVelocity = 0;
    pendulumAngleAcceleration = 0;
    pendulumRunning = true;
    
    // Also reset sliders to defaults
    const lengthSlider = document.getElementById('length-slider');
    const gravitySlider = document.getElementById('gravity-slider');
    const dampingSlider = document.getElementById('damping-slider');
    
    if (lengthSlider) {
        lengthSlider.value = 200;
        pendulumLength = 200;
        const lengthValueElement = document.getElementById('length-value');
        if (lengthValueElement) {
            lengthValueElement.textContent = '200 cm';
        }
    }
    
    if (gravitySlider) {
        gravitySlider.value = 9.8;
        pendulumGravity = 9.8;
        const gravityValueElement = document.getElementById('gravity-value');
        if (gravityValueElement) {
            gravityValueElement.textContent = '9.8 m/s²';
        }
    }
    
    if (dampingSlider) {
        dampingSlider.value = 0.995;
        pendulumDamping = 0.995;
        const dampingValueElement = document.getElementById('damping-value');
        if (dampingValueElement) {
            dampingValueElement.textContent = '0.5%';
        }
    }
    
    // Update button text if needed
    const pauseButton = document.getElementById('pendulum-pause');
    if (pauseButton) {
        pauseButton.textContent = 'Pause';
    }
    
    // Update positions
    updatePendulumPositions();
}

// Simple animation for homepage
function initHomePageAnimation(canvas) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple pendulum animation for homepage
    let time = 0;
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#111827');
        gradient.addColorStop(1, '#1E3A8A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Draw background pattern
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                width * (0.2 + i * 0.15), 
                height * 0.5, 
                20 + i * 15, 
                0, 
                Math.PI * 2
            );
            ctx.fill();
        }
        
        // Draw pendulum (faster animation)
        const originX = width / 2;
        const originY = height * 0.3;
        const pendulumLen = height * 0.4;
        const angle = Math.PI / 4 * Math.sin(time * 5); // Increased speed (5x)
        
        const bobX = originX + Math.sin(angle) * pendulumLen;
        const bobY = originY + Math.cos(angle) * pendulumLen;
        
        // String
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Pivot
        ctx.beginPath();
        ctx.arc(originX, originY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1f2937';
        ctx.fill();
        
        // Bob
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        
        // Gradient for 3D effect
        const bobGradient = ctx.createRadialGradient(
            bobX - 5, bobY - 5, 0,
            bobX, bobY, 20
        );
        bobGradient.addColorStop(0, '#3b82f6');
        bobGradient.addColorStop(1, '#1d4ed8');
        
        ctx.fillStyle = bobGradient;
        ctx.fill();
        
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add highlight to bob
        ctx.beginPath();
        ctx.arc(bobX - 7, bobY - 7, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        // Update time and request next frame
        time += 0.016; // Fixed time step
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize pendulum when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the simulations page or if there's a pendulum container
    if (document.querySelector('.pendulum-container')) {
        initPendulumSimulation();
    }
    
    // Also initialize the pendulum if we're on the homepage with the hero-canvas
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        // Homepage animation with simpler pendulum
        initHomePageAnimation(heroCanvas);
    }
});