// Global variables
let waveCanvas, waveCtx;
let waveWidth, waveHeight;
let waveRunning = true;
let waveTime = 0;
let waveSources = [
    { x: 0.3, y: 0.5, frequency: 0.2, amplitude: 1, phase: 0 },
    { x: 0.7, y: 0.5, frequency: 0.2, amplitude: 1, phase: Math.PI }
];

function initWaveSimulation() {
    // Get the container
    const waveContainer = document.querySelector('.wave-container');
    if (!waveContainer) return;
    
    // Create canvas
    waveCanvas = document.createElement('canvas');
    waveCanvas.width = waveContainer.offsetWidth;
    waveCanvas.height = waveContainer.offsetHeight;
    waveWidth = waveCanvas.width;
    waveHeight = waveCanvas.height;
    waveContainer.appendChild(waveCanvas);
    
    // Get context
    waveCtx = waveCanvas.getContext('2d');
    
    // Handle window resize
    window.addEventListener('resize', function() {
        waveCanvas.width = waveContainer.offsetWidth;
        waveCanvas.height = waveContainer.offsetHeight;
        waveWidth = waveCanvas.width;
        waveHeight = waveCanvas.height;
    });
    
    // Start animation
    requestAnimationFrame(animateWave);
}

function animateWave() {
    if (!waveRunning) return;
    
    // Clear canvas
    waveCtx.clearRect(0, 0, waveWidth, waveHeight);
    
    // Draw wave pattern
    drawWavePattern();
    
    // Update time
    waveTime += 0.05;
    
    // Request next frame
    requestAnimationFrame(animateWave);
}

function drawWavePattern() {
    // Create imageData for pixel manipulation
    const imageData = waveCtx.createImageData(waveWidth, waveHeight);
    const data = imageData.data;
    
    // Calculate wave interference for each pixel
    for (let x = 0; x < waveWidth; x++) {
        for (let y = 0; y < waveHeight; y++) {
            // Normalize coordinates
            const nx = x / waveWidth;
            const ny = y / waveHeight;
            
            // Calculate combined wave amplitude at this point
            let amplitude = 0;
            
            for (const source of waveSources) {
                // Calculate distance from source
                const dx = nx - source.x;
                const dy = ny - source.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Calculate wave effect at this point
                const wave = Math.sin(distance * 50 * source.frequency - waveTime + source.phase);
                const falloff = 1 / (1 + distance * 5);
                
                amplitude += wave * falloff * source.amplitude;
            }
            
            // Normalize amplitude to 0-1 range
            amplitude = amplitude * 0.5 + 0.5;
            
            // Set pixel color based on amplitude
            const index = (y * waveWidth + x) * 4;
            data[index] = Math.floor(0 * amplitude); // R
            data[index + 1] = Math.floor(127 + 128 * amplitude); // G
            data[index + 2] = Math.floor(255 * amplitude); // B
            data[index + 3] = 255; // Alpha
        }
    }
    
    // Put image data back to canvas
    waveCtx.putImageData(imageData, 0, 0);
}