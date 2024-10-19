// Import required modules
const express = require('express');
const fs = require('fs');

// Initialize Express application
const app = express();
const port = 3000;

// Helper functions

/**
 * Calculate the amount of milk a yak produces on a given day.
 * @param {number} age - The age of the yak in years.
 * @param {number} days - The number of days since the start.
 * @returns {number} The amount of milk produced (in liters).
 */
const calculateMilk = (age, days) => {
    // Calculate milk production based on the formula: 50 - D * 0.03 liters
    // where D is the age in days
    return Math.max(0, 50 - (age * 100 + days) * 0.03);
};

/**
 * Determine if a yak can be shaved based on its last shaving and current age.
 * @param {number} lastShaved - The age when the yak was last shaved.
 * @param {number} currentAge - The current age of the yak.
 * @returns {boolean} True if the yak can be shaved, false otherwise.
 */
const canBeShaved = (lastShaved, currentAge) => {
    // Calculate the number of days since the last shave
    const daysSinceLastShave = (currentAge - lastShaved) * 100;
    // Check if enough days have passed since the last shave
    // The formula is: 8 + D * 0.01 days, where D is the age in days
    return daysSinceLastShave >= 8 + lastShaved * 100 * 0.01;
};

// Load initial herd data from the JSON file specified in command line arguments
const herdData = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

// Initialize the herd with additional properties
const herd = herdData.herd.map(yak => ({
    ...yak,
    ageDays: yak.age * 100, // Convert age to days
    lastShaved: yak.age >= 1 ? yak.age : null // Set lastShaved to current age if yak is at least 1 year old, otherwise null
}));

// Stock route: Calculate total milk and skins produced after a specified number of days
app.get('/yak-shop/stock/:days', (req, res) => {
    const days = parseInt(req.params.days);
    let milk = 0;
    let skins = 0;

    herd.forEach(yak => {
        // Calculate milk production for female yaks
        if (yak.sex === 'f') {
            for (let i = 0; i < days; i++) {
                milk += calculateMilk(yak.age, i);
            }
        }

        // Calculate skin production for all yaks
        let currentAge = yak.age;
        let lastShaved = yak.lastShaved;
        for (let i = 0; i < days; i++) {
            // Check if yak can be shaved (age between 1 and 10, and enough time has passed since last shave)
            if (currentAge >= 1 && currentAge < 10 && canBeShaved(lastShaved, currentAge)) {
                skins++;
                lastShaved = currentAge;
            }
            currentAge += 1/100; // Increment age by one day
        }
    });

    // Send JSON response with total milk and skins
    res.json({
        milk: parseFloat(milk.toFixed(2)), // Round milk to 2 decimal places
        skins
    });
});

// Herd route: Get the status of the herd after a specified number of days
app.get('/yak-shop/herd/:days', (req, res) => {
    const days = parseInt(req.params.days);
    const updatedHerd = herd.map(yak => {
        let currentAge = yak.age + days/100; // Calculate new age
        let lastShaved = yak.lastShaved;

        // Check if yak has died (reached 10 years old)
        if (currentAge >= 10) {
            return null; // Yak has died
        }

        // Simulate each day to update lastShaved
        for (let i = 0; i < days; i++) {
            if (currentAge >= 1 && canBeShaved(lastShaved, currentAge)) {
                lastShaved = currentAge;
            }
            currentAge += 1/100; // Increment age by one day
        }

        // Return updated yak information
        return {
            name: yak.name,
            age: parseFloat(currentAge.toFixed(2)), // Round age to 2 decimal places
            "age-last-shaved": lastShaved ? parseFloat(lastShaved.toFixed(2)) : null // Round lastShaved to 2 decimal places, or null if never shaved
        };
    }).filter(yak => yak !== null); // Remove dead yaks from the herd

    // Send JSON response with updated herd information
    res.json({ herd: updatedHerd });
});

// Start the server
app.listen(port, () => {
    console.log(`YakShop app listening at http://localhost:${port}`);
});
