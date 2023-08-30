// This file contains the data and functions related to hurricanes

// Export the variable to make it accessible in other files
export let hurricaneDates = {};

// Function to load hurricane dates from a text file
export async function loadHurricaneDates() {
    try {
        const response = await fetch('hurricanes.txt');
        const text = await response.text();
        const lines = text.split('\n');
        hurricaneDates = {};

        lines.forEach(line => {
            const [name, date] = line.split(',');
            hurricaneDates[name] = new Date(date);
        });

        return hurricaneDates;
    } catch (error) {
        console.error("Error loading hurricane data:", error);
    }
}