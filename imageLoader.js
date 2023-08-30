// Image loading logic
let images = [];
let dates = [];

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
    images = []; // Clear the images array
    dates = []; // Clear the dates array
    // ... (rest of the code for generating URLs and loading images)
}