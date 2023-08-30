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

// Function to load an image from a URL
async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
    });
}

// Function to load and play the animation
async function loadAndPlayAnimation(startDate, endDate) {
    clearInterval(animationInterval); // Clear previous animation interval
    images = []; // Clear images array
    dates = []; // Clear dates array

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
            console.log(`Loaded n0q image ${i + 1} of ${totalHours + 1}`);
        } catch (error) {
            console.warn('Failed to load n0q image:', radarUrlN0Q);
            try {
                const img = await loadImage(radarUrlN0R);
                images.push(img);
                console.log(`Loaded n0r image ${i + 1} of ${totalHours + 1}`);
            } catch (error) {
                console.error('Failed to load both n0q and n0r images:', radarUrlN0Q, radarUrlN0R);
            }
        }
    }

    playAnimationWithOverlay(); // Call the function to play the animation
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
    "Donna (9/10/1960)": new Date("9/10/1960"),
    "Camille (8/17/1969)": new Date("8/17/1969"),
    "Gloria (9/27/1985)": new Date("9/27/1985"),
    "Hugo (9/22/1989)": new Date("9/22/1989"),
    "Andrew (8/24/1992)": new Date("8/24/1992"),
    "Isabel (9/18/2003)": new Date("9/18/2003"),
    "Charley (8/13/2004)": new Date("8/13/2004"),
    "Frances (9/5/2004)": new Date("9/5/2004"),
    "Ivan (9/16/2004)": new Date("9/16/2004"),
    "Jeanne (9/26/2004)": new Date("9/26/2004"),
    "Katrina (8/29/2005)": new Date("8/29/2005"),
    "Rita (9/24/2005)": new Date("9/24/2005"),
    "Wilma (10/24/2005)": new Date("10/24/2005"),
    "Ike (9/13/2008)": new Date("9/13/2008"),
    "Sandy (10/29/2012)": new Date("10/29/2012"),
    "Matthew (10/8/2016)": new Date("10/8/2016"),
    "Harvey (8/25/2017)": new Date("8/25/2017"),
    "Irma (9/10/2017)": new Date("9/10/2017"),
    "Maria (9/20/2017)": new Date("9/20/2017"),
    "Michael (10/10/2018)": new Date("10/10/2018")
};

// Populate the hurricane dropdown dynamically
const hurricaneDropdown = document.getElementById('hurricaneSelect');
for (const [hurricaneName, landfallDate] of Object.entries(hurricaneDates)) {
    const option = document.createElement('option');
    option.value = hurricaneName;
    option.text = hurricaneName;
    hurricaneDropdown.appendChild(option);
}

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
