// Animation logic
let animationInterval;
let currentFrameIndex = 0; // Initialize here

function playAnimationWithOverlay() {
    const animationDuration = 50;
    const ctx = animationCanvas.getContext('2d');
    const canvasWidth = animationCanvas.width;
    const canvasHeight = animationCanvas.height;

    function animate() {
        console.log(`Current frame index: ${currentFrameIndex}`);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(images[currentFrameIndex], 0, 0, canvasWidth, canvasHeight);

        const currentHour = dates[currentFrameIndex];
        const formattedDate = currentHour.toLocaleString();
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(formattedDate, 10, canvasHeight - 10);

        currentFrameIndex = (currentFrameIndex + 1) % images.length;
    }

    animationInterval = setInterval(animate, animationDuration);
    console.log('Animation started.');
    currentFrameIndex = 0; // Reset index
}