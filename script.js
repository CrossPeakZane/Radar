const animationCanvas = document.getElementById('animationCanvas');
const generateButton = document.getElementById('generateButton');

async function playAnimationWithOverlay(images, dates) {
    const animationDuration = 50;
    const ctx = animationCanvas.getContext('2d');
    const canvasWidth = animationCanvas.width;
    const canvasHeight = animationCanvas.height;
    let currentFrameIndex = 0;

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(images[currentFrameIndex], 0, 0, canvasWidth, canvasHeight);

        // Add date and time overlay
        const currentHour = dates[currentFrameIndex];
        const formattedDate = currentHour.toLocaleString();
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(formattedDate, 10, canvasHeight - 10);

        currentFrameIndex = (currentFrameIndex + 1) % images.length;
        setTimeout(animate, animationDuration);
    }

    animate();
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image(); img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

async function loadAndPlayAnimation(startDate, endDate) {
    const loadingBar = document.createElement('div');
    loadingBar.style.position = 'fixed';
    loadingBar.style.top = '0';
    loadingBar.style.left = '0';
    loadingBar.style.width = '0';
    loadingBar.style.height = '5px';
    loadingBar.style.background = '#007bff';
    loadingBar.style.transition = 'width 0.5s';
    document.body.appendChild(loadingBar);
    const totalHours = Math.abs((endDate - startDate) / 36e5);
    const images = [];
    const dates = [];
    for (let i = 0; i <= totalHours; i++) {
        const currentHour = new Date(startDate);
        currentHour.setHours(currentHour.getHours() + i);
        dates.push(currentHour);
        const formattedHour = String(currentHour.getUTCHours()).padStart(2, '0');
        const formattedYear = currentHour.getUTCFullYear();
        const formattedMonth = String(currentHour.getUTCMonth() + 1).padStart(2, '0');
        const formattedDay = String(currentHour.getUTCDate()).padStart(2, '0');
        const radarUrl = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0q_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}00.png`;
        try {
            const img = await loadImage(radarUrl);
            images.push(img);
            loadingBar.style.width = `${(i / totalHours) * 100}%`;
        } catch (error) {
            console.error('Failed to load image:', radarUrl, error);
        }
    }
    loadingBar.style.display = 'none';
    playAnimationWithOverlay(images, dates);
}

generateButton.addEventListener('click', async () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    // Create a new canvas for each animation
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    // Load and play new animation
    loadAndPlayAnimation(startDate, endDate);
});