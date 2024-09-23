let generals = 0;
let leftOffTimer = 0;

let upgradeTimers = {
    speed: 0,
    combat: 0,
    hp: 0,
    hazard: 0,
    soldiers: 0
};

let generalsAssigned = {
    speed: 0,
    combat: 0,
    hp: 0,
    hazard: 0,
    soldiers: 0

};

let upgradeTimeBase = {
    speed: 1,
    combat: 1,
    hp: 1,
    hazard: 1,
    soldiers: 1

};
function buyGeneral() {
    const generalCost = 10;
    if (Science >= generalCost) {
        Science -= generalCost;
        generals += 1;
        document.getElementById('generals-count').textContent = generals;
        document.getElementById('Science').textContent = Science;
        initializeGeneralButtons();   }
    
}

function assignGeneralsToUpgrade(type) {
    if (generals > 0) {
        generalsAssigned[type] += 1;
        generals -= 1;

        // Update UI
        document.getElementById('generals-count').textContent = generals;
        document.getElementById(`${type}-general-count`).textContent = generalsAssigned[type];

        if (upgradeTimers[type] > 0) {
            adjustTimerForNewGeneral(type);
        } 
        if (generalsAssigned[type] === 1) { // Only start if this is the first general being assigned
            startUpgradeTimer(type,upgradeTimeBase[type] - upgradeTimers[type]); // Start fresh if not already upgrading
        }
        
        initializeGeneralButtons();
    }
}


function adjustTimerForNewGeneral(type) {
    const remainingTime = upgradeTimers[type]; // Get the current remaining time
    const generalsUsed = generalsAssigned[type]; // Current number of generals

    // Prevent division by zero, ensure at least one general is present
    if (generalsUsed > 1) {
        const newRemainingTime = remainingTime * (generalsUsed / (generalsUsed - 1));
        upgradeTimers[type] = newRemainingTime; // Update the timer
    }
}

function removeGeneralsFromUpgrade(type) {
    if (generalsAssigned[type] > 0) {
        generals += 1;  // Free up assigned generals
        generalsAssigned[type] -= 1;

        // Update UI
        document.getElementById('generals-count').textContent = generals;
        document.getElementById(`${type}-general-count`).textContent = generalsAssigned[type];

        // If no generals are left assigned, freeze the upgrade
        if (generalsAssigned[type] === 0) {
            freezeUpgrade(type);
        }
    }
    initializeGeneralButtons();
}

// Make sure to call initializeGeneralButtons after your game initializes
initializeGeneralButtons();

function freezeUpgrade(type) {
    // Clear the interval to stop the timer
    if (upgradeIntervals[type]) {
        addMessage(upgradeTimers[type]*1000);
        addMessage(upgradeTimeBase[type]*1000);

        clearInterval(upgradeIntervals[type]);
        delete upgradeIntervals[type]; // Remove interval reference
    }

}



let upgradeIntervals = {}; // Store intervals for each upgrade type

function startUpgradeTimer(type, leftOffTimer = 0) {
    const baseDuration = upgradeTimeBase[type]; // Base duration for this upgrade level
    const generalsUsed = Math.max(generalsAssigned[type], 1); // Prevent division by zero

    // Calculate upgrade duration based on the number of generals
    const baseUpgradeDuration = baseDuration / generalsUsed;
    const upgradeDuration = (baseDuration-leftOffTimer) / generalsUsed;
    upgradeTimers[type] = upgradeDuration;

    const progressElement = document.getElementById(`${type}-upgrade-progress`);
    const timerElement = document.getElementById(`${type}-upgrade-timer`);

    let remainingDuration = upgradeDuration;

    // Countdown timer
    const interval = setInterval(() => {
        remainingDuration -= 0.1;
        upgradeTimers[type] = remainingDuration;

        // Update circular progress
        const progressPercent = ((baseUpgradeDuration - remainingDuration) / baseUpgradeDuration) * 100;
        progressElement.style.strokeDasharray = `${progressPercent}, 100`;

        // Update the text inside the progress circle
        timerElement.textContent = Math.max(remainingDuration.toFixed(1), 0);

        // Check if the timer is complete
        if (remainingDuration <= 0) {
            clearInterval(interval);
            delete upgradeIntervals[type]; // Remove interval reference
            completeUpgrade(type);
        }
    }, 100); // Update every 100ms

    upgradeIntervals[type] = interval; // Store the interval reference
}



function completeUpgrade(type) {
    upgradeTimers[type] = 0;

    // Perform the upgrade (level up)
    switch (type) {
        case 'speed':
            baseSpeed += 1;
            document.getElementById('speed-level').textContent = baseSpeed;
            break;
        case 'combat':
            baseCombat += 1;
            document.getElementById('combat-level').textContent = baseCombat;
            break;
        case 'hp':
            baseHP += 1;
            document.getElementById('hp-level').textContent = baseHP;
            break;
        case 'hazard':
            hazardRemediation += 1;
            document.getElementById('hazard-level').textContent = hazardRemediation;
            break;
        case 'soldiers':
            combatSoldiers += 1;
            document.getElementById('soldiers-level').textContent = combatSoldiers;
            break;
    }

    // Double the duration for the next upgrade level
    upgradeTimeBase[type] *= 2;

    // Continue to the next level upgrade, keeping the assigned generals
    if (generalsAssigned[type] > 0) {
        startUpgradeTimer(type); // Automatically start the next level upgrade
    }
}
function updateGeneralButtons(type) {
    const assignButton = document.getElementById(`${type}-general-assign`);
    const removeButton = document.getElementById(`${type}-general-remove`);
    
    // Disable assign button if no generals available
    assignButton.disabled = generals <= 0;

    // Disable remove button if no generals are assigned to the upgrade
    removeButton.disabled = generalsAssigned[type] <= 0;
}
// Call this function for all upgrade types initially to set the correct button state
function initializeGeneralButtons() {
    const upgradeTypes = ['speed', 'combat', 'hp', 'hazard', 'soldiers']; // Add all your upgrade types here
    upgradeTypes.forEach(updateGeneralButtons);
}

// Call initializeGeneralButtons after your game initializes
initializeGeneralButtons();