// Main entry point for the application
document.addEventListener("DOMContentLoaded", function() {
    console.log("Application initialized.");
    
    // Initialize the loading bar
    setupLoadingBar();
    
    // Load hurricane data and populate the dropdown
    loadHurricaneDates().then(() => {
        console.log("Hurricane data loaded.");
    }).catch(err => {
        console.error("Error loading hurricane data:", err);
    });

    // Setup event listeners for user interactions
    setupEventListeners();
});

function setupEventListeners() {
    console.log("Setting up event listeners...");

    // Event listener for the 'Generate' button
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', async () => {
        console.log("'Generate' button clicked.");
        
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        // Validate date inputs
        if (startDate && endDate) {
            console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
            loadAndPlayAnimation(startDate, endDate);
        } else {
            console.error("Invalid date inputs.");
        }
    });

    // Event listener for the hurricane dropdown
    const hurricaneSelect = document.getElementById('hurricaneSelect');
    hurricaneSelect.addEventListener('change', () => {
        console.log("Hurricane selected from dropdown.");
        
        const selectedHurricane = hurricaneSelect.value;
        if (hurricaneDates[selectedHurricane]) {
            const landfallDate = hurricaneDates[selectedHurricane];
            const startDate = new Date(landfallDate);
            startDate.setDate(startDate.getDate() - 3);
            const endDate = new Date(landfallDate);
            endDate.setDate(endDate.getDate() + 4);

            document.getElementById('startDate').valueAsDate = startDate;
            document.getElementById('endDate').valueAsDate = endDate;
        } else {
            console.error("Invalid hurricane selection.");
        }
    });

    console.log("Event listeners set up.");
}