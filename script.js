console.log("Script started.");

const animationCanvas = document.getElementById('animationCanvas');
console.log("Canvas element:", animationCanvas);

const generateButton = document.getElementById('generateButton');
console.log("Generate button element:", generateButton);

let images = [];
let dates = [];
let animationInterval;

console.log("Defining playAnimationWithOverlay function...");
function playAnimationWithOverlay() {
    const animationDuration = 50;
    const ctx = animationCanvas.getContext('2d');
    const canvasWidth = animationCanvas.width;
    const canvasHeight = animationCanvas.height;
    let currentFrameIndex = 0;

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(images[currentFrameIndex], 0, 0, canvasWidth, canvasHeight);
        const currentHour = dates[currentFrameIndex];
        const formattedDate = currentHour.toLocaleString();
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(formattedDate, 10, canvasHeight - 10);
        currentFrameIndex = (currentFrameIndex + 1) % images.length;
    }

    animationInterval = setInterval(animate, animationDuration);
    console.log("Animation started.");
}

console.log("Defining loadImage function...");
async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

console.log("Defining loadAndPlayAnimation function...");
async function loadAndPlayAnimation(startDate, endDate) {
    clearInterval(animationInterval);
    images = [];
    dates = [];
    const totalHours = Math.abs((endDate - startDate) / 36e5);

    for (let i = 0; i <= totalHours; i++) {
        const currentHour = new Date(startDate);
        currentHour.setHours(currentHour.getHours() + i);
        dates.push(currentHour);
        const formattedHour = String(currentHour.getUTCHours()).padStart(2, '0');
        const formattedYear = currentHour.getUTCFullYear();
        const formattedMonth = String(currentHour.getUTCMonth() + 1).padStart(2, '0');
        const formattedDay = String(currentHour.getUTCDate()).padStart(2, '0');
        const radarUrlN0Q = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0q_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}00.png`;
        const radarUrlN0R = `https://mesonet.agron.iastate.edu/archive/data/${formattedYear}/${formattedMonth}/${formattedDay}/GIS/uscomp/n0r_${formattedYear}${formattedMonth}${formattedDay}${formattedHour}00.png`;

        try {
            const img = await loadImage(radarUrlN0Q);
            images.push(img);
        } catch (error) {
            try {
                const img = await loadImage(radarUrlN0R);
                images.push(img);
            } catch (error) {
                console.error('Failed to load both n0q and n0r images:', radarUrlN0Q, radarUrlN0R);
            }
        }
    }
    playAnimationWithOverlay();
    console.log("Animation loaded and played.");
}

generateButton.addEventListener('click', async () => {
    console.log("Generate button clicked.");
    const startDate = new Date(document.getElementById('startDate').value);
    console.log("Start date:", startDate);
    const endDate = new Date(document.getElementById('endDate').value);
    console.log("End date:", endDate);
    loadAndPlayAnimation(startDate, endDate);
});

console.log("Populating dropdown...");
const hurricaneDropdown = document.getElementById('hurricaneSelect');
const hurricaneDates = {
    // Your hurricane dates here
};
for (const [hurricaneName, landfallDate] of Object.entries(hurricaneDates)) {
    console.log(`Adding option: ${hurricaneName}`);
    const option = document.createElement('option');
    option.value = hurricaneName;
    option.text = hurricaneName;
    hurricaneDropdown.appendChild(option);
}
console.log("Dropdown populated.");

const hurricaneSelect = document.getElementById('hurricaneSelect');
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
    console.log("Hurricane selected.");
});
