const animationCanvas = document.getElementById('animationCanvas');
const generateButton = document.getElementById('generateButton');
let images = [];
let dates = [];
let animationInterval;
let hurricaneDates = {};

async function playAnimationWithOverlay() {
 
    const animationDuration = 50;
    const ctx = animationCanvas.getContext('2d');
    const canvasWidth = animationCanvas.width;
    const canvasHeight = animationCanvas.height;
    let currentFrameIndex = 0;

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
}

async function loadImage(url, index) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve({ img, index });
        img.onerror = (error) => reject(error);
    });
}

async function loadAndPlayAnimation(startDate, endDate) {
    clearInterval(animationInterval);
    images = [];
    dates = [];

    const loadingBar = document.createElement('div');
    loadingBar.style.position = 'fixed';
    loadingBar.style.top = '0';
    loadingBar.style.left = '0';
    loadingBar.style.width = '0';
    loadingBar.style.height = '5px';
    loadingBar.style.background = '#007bff';
    loadingBar.style.transition = 'width 0.5s';
    document.body.appendChild(loadingBar);

    const totalMinutes = Math.abs((endDate - startDate) / 60000);
    const minuteIncrement = 15;
    let completedDownloads = 0;

    const updateLoadingBar = () => {
        loadingBar.style.width = `${(completedDownloads / totalMinutes) * 100}%`;
    };

    const imagePromises = []; // Array to hold all image promises

    for (let i = 0; i <= totalMinutes; i += minuteIncrement) {
        const currentMinute = new Date(startDate);
        currentMinute.setMinutes(currentMinute.getMinutes() + i);
        dates.push(currentMinute);

        const formattedMinute = String(currentMinute.getUTCMinutes()).padStart(2, '0');
        const formattedHour = String(currentMinute.getUTCHours()).padStart(2, '0');
        const formattedYear = currentMinute.getUTCFullYear();
        const formattedMonth = String(currentMinute.getUTCMonth() + 1).padStart(2, '0');
        const formattedDay = String(currentMinute.getUTCDate()).padStart(2, '0');

        const radarUrlN0Q = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0q_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}${formattedMinute}.png`;
        const radarUrlN0R = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0r_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}${formattedMinute}.png`;

        const imagePromise = loadImage(radarUrlN0Q, i)
            .then(img => {
                images.push(img);
                completedDownloads += minuteIncrement;
                updateLoadingBar();
            })
            .catch(error => {
                return loadImage(radarUrlN0R, i)
                    .then(img => {
                        images.push(img);
                        completedDownloads += minuteIncrement;
                        updateLoadingBar();
                    })
                    .catch(error => {
                        console.error('Failed to load both n0q and n0r images:', radarUrlN0Q, radarUrlN0R);
                    });
            });

        imagePromises.push(imagePromise); // Add each promise to the array
    }

    await Promise.all(imagePromises); // Wait for all promises to resolve

    images.sort((a, b) => a.index - b.index);
    images = images.map(item => item.img);

    loadingBar.style.display = 'none';

    console.log(`Total frames: ${images.length}`);
    playAnimationWithOverlay();
}

generateButton.addEventListener('click', async () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    loadAndPlayAnimation(startDate, endDate);
});

const hurricaneSelect = document.getElementById('hurricaneSelect');

async function loadHurricaneDates() {
    const response = await fetch('hurricanes.txt');
    const text = await response.text();
    const lines = text.split('\n');
    hurricaneDates = {};

    lines.forEach(line => {
        const [name, date] = line.split(',');
        hurricaneDates[name] = new Date(date);
    });

    return hurricaneDates;
}

window.addEventListener('load', async () => {
    const hurricaneDates = await loadHurricaneDates();
    const hurricaneDropdown = document.getElementById('hurricaneSelect');

    for (const [name, date] of Object.entries(hurricaneDates)) {
        const option = document.createElement('option');
        option.value = name;
        option.text = `${name} (${date.toLocaleDateString()})`;
        hurricaneDropdown.appendChild(option);
    }
});

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