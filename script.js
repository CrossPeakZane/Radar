const animationCanvas = document.getElementById('animationCanvas');
const generateButton = document.getElementById('generateButton');
let images = []; // Array to store loaded images
let dates = []; // Array to store corresponding dates
let animationInterval; // Variable to hold animation interval

function playAnimationWithOverlay() {
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
    }

    animationInterval = setInterval(animate, animationDuration);
    console.log('Animation started.');
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image(); img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

async function loadAndPlayAnimation(startDate, endDate) {
    clearInterval(animationInterval); // Clear previous animation interval
    images = []; // Clear images array
    dates = []; // Clear dates array

    const loadingBar = document.createElement('div');
    loadingBar.style.position = 'fixed';
    loadingBar.style.top = '0';
    loadingBar.style.left = '0';
    loadingBar.style.width = '0';
    loadingBar.style.height = '5px';
    loadingBar.style.background = '#007bff';
    loadingBar.style.transition = 'width 0.5s';
    document.body.appendChild(loadingBar);

    console.log('Loading images...');

    const totalHours = Math.abs((endDate - startDate) / 36e5);

    for (let i = 0; i <= totalHours; i++) {
        const currentHour = new Date(startDate);
        currentHour.setHours(currentHour.getHours() + i);
        dates.push(currentHour);
        const formattedHour = String(currentHour.getUTCHours()).padStart(2, '0');
        const formattedYear = currentHour.getUTCFullYear();
        const formattedMonth = String(currentHour.getUTCMonth() + 1).padStart(2, '0');
        const formattedDay = String(currentHour.getUTCDate()).padStart(2, '0');
        const radarUrl = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0q_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}00.png`;

      console.log(`Radar URL for ${formattedYear}-${formattedMonth}-${formattedDay} ${formattedHour}:00 UTC: ${radarUrl}`);
      
        try {
            const img = await loadImage(radarUrl);
            images.push(img);
            loadingBar.style.width = `${(i / totalHours) * 100}%`;
            console.log(`Loaded image ${i + 1} of ${totalHours + 1}`);
        } catch (error) {
            console.error('Failed to load image:', radarUrl, error);
        }
    }
    loadingBar.style.display = 'none';
    console.log('All images loaded.');
    playAnimationWithOverlay();
}

generateButton.addEventListener('click', async () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    // Load and play new animation
    loadAndPlayAnimation(startDate, endDate);
});
// Existing code
const hurricaneSelect = document.getElementById('hurricaneSelect');

const hurricaneDates = {
    "Katrina": new Date("8/29/2005"),
    "Sandy": new Date("10/29/2012"),
    // Add more hurricanes and their landfall dates here
};

hurricaneSelect.addEventListener('change', () => {
    const selectedHurricane = hurricaneSelect.value;
    if (hurricaneDates[selectedHurricane]) {
        const landfallDate = hurricaneDates[selectedHurricane];
        const startDate = new Date(landfallDate);
        startDate.setDate(startDate.getDate() - 3);
        const endDate = new Date(landfallDate);
        endDate.setDate(endDate.getDate() + 4);

        document.getElementById('startDate').valueAsDate = startDate;
        document.getElementById('endDate').valueAsDate = endDate;
    }
});

// Existing code
