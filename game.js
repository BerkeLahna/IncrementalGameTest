let soldiers = 0;
let money = 0;
let Gun = 10;
let GunPrice = 10;
let automationLevel = 0; // Start with no automation
let marketingLevel = 1;
let soldierProductionInterval = null;
let GunPriceInterval = null;
let soldierPrice = 10;
let GunUpgradeLevel = 1;
let GunUpgradeCost = 200;
let odds = 0.0;
let oddsCost = 200;
let tooltipVisible = false;
let Science = 0;
const vialIconPath = 'vial.webp';




const baseSellRate = 20;  // Lower base rate
const pricePenalty = 0.5; // Increase penalty for higher prices
const GunPriceChangeIntervalMin = 5000; // Minimum time for Gun price change (5 seconds)
const GunPriceChangeIntervalMax = 10000; // Maximum time for Gun price change (10 seconds)
const automationCostBase = 100; // Base cost for automation
const automationCostScale = 1.5; // Cost scaling factor for each additional automation level
const GunUpgradeBaseCost = 200; // Base cost for Gun upgrade
const GunUpgradeScale = 2; // Scaling factor for Gun upgrade cost

function updateDisplay() {
    document.getElementById('soldiers-count').textContent = `Soldiers: ${soldiers}`;
    document.getElementById('price-input').value = `${soldierPrice}`;
    document.getElementById('money-count').textContent = `Money: $${money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.')}`;
    document.getElementById('Gun-count').textContent = `Gun: ${Gun}`;
    document.getElementById('Gun-cost').textContent = `Current Gun Price: $${GunPrice}`;
    document.getElementById('marketing-level').textContent = `Marketing Level: ${marketingLevel} (Cost: $${50 * 2**marketingLevel})`;

    // Disable produce button if no Gun
    document.getElementById('produce-soldier').disabled = (Gun <= 0);

    // Disable buy Gun button if not enough money
    document.getElementById('buy-Gun').disabled = (money < GunPrice);

    // Disable buy marketing button if not enough money
    document.getElementById('buy-marketing').disabled = (money < 50 * 2**marketingLevel);

    // Disable buy automation button if not enough money
    let automationCost = automationCostBase * Math.pow(automationCostScale, automationLevel);
    document.getElementById('buy-automation').disabled = (money < automationCost);
    document.getElementById('buy-automation').textContent = `Buy Automation (Cost: $${automationCost.toFixed(2)})`;
    document.getElementById('buy-automation1').textContent = `Produces ${automationLevel} soldier(s)/sec`;

    // Disable buy Gun upgrade button if not enough money
    let GunUpgradeCost = GunUpgradeBaseCost * Math.pow(GunUpgradeScale, GunUpgradeLevel);
    document.getElementById('buy-Gun-upgrade').disabled = (money < GunUpgradeCost);
    document.getElementById('Gun-upgrade-level').textContent = `Gun Upgrade Level: ${GunUpgradeLevel} (Cost: $${GunUpgradeCost})`;

    document.getElementById('war-odds1').textContent = `Increased odds of winning by: ${odds*100}%`;
    document.getElementById('war-odds').innerHTML = `Increase odds of winning ${"Cost: " + oddsCost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.') + ' <img src="' + vialIconPath + '" alt="Technology" style="width:16px; vertical-align:middle;">'}`;
    // document.getElementById('war-odds').disabled = (money < oddsCost);
    // document.getElementById('war-odds').disabled = (odds > 0.4);
    updateOddsButton();
    const tooltip = document.getElementById('tooltip');

    document.getElementById('Science').innerHTML = `<img src="${vialIconPath}" alt="Technology" style="width:16px; vertical-align:middle;">: ${Science}`;

}

let tooltipTimeout;

function showDynamicTooltip(event, risk, multiplier) {
    const dynamicOdds = (1-(risk - odds)) * 100;
    showTooltip(event, `Odds: ${dynamicOdds.toFixed(2)}%, Multiplier: ${multiplier}`);
}

// Function to show the tooltip
function showTooltip(event, message) {
    tooltip.textContent = message;
    tooltip.style.display = 'block';
    tooltip.style.opacity = 1;
    positionTooltip(event);
    tooltipVisible = true; // Mark tooltip as visible
}

function hideTooltip() {
    if (!tooltipVisible) return; // Only hide if the tooltip is currently visible
    tooltip.style.opacity = 0;
    setTimeout(() => {
        if (!tooltipVisible) { // Only hide the tooltip if it's not visible anymore
            tooltip.style.display = 'none';
        }
    }, 200); // Wait for the fade-out transition
}


// Function to position the tooltip properly without glitching
function positionTooltip(event) {
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const margin = 10; // Margin between cursor and tooltip

    // Calculate tooltip position (make sure it stays within the window)
    let left = event.pageX + margin;
    let top = event.pageY + margin;

    // Prevent tooltip from going off-screen
    if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - margin;
    }
    if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - margin;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

// Update button state and attach tooltip event listeners
function updateOddsButton() {
    const oddsButton = document.getElementById('war-odds');
    
    if (odds > 0.4) {
        oddsButton.disabled = true;
        oddsButton.addEventListener('mousemove', (event) => {
            showTooltip(event, "Max level reached");
            positionTooltip(event);  // Update the position as the mouse moves
        });
        oddsButton.addEventListener('mouseleave', hideTooltip);
    }else if (Science < oddsCost) {
        oddsButton.disabled = true;
        oddsButton.addEventListener('mousemove', (event) => {
            showTooltip(event, "Not enough Science");
            positionTooltip(event);  // Update the position as the mouse moves
        });
        oddsButton.addEventListener('mouseleave', hideTooltip);
    }   else {
        oddsButton.disabled = false;
        oddsButton.removeEventListener('mousemove', showTooltip);
        oddsButton.removeEventListener('mouseleave', hideTooltip);
        hideTooltip();
    }
}




function produceSoldier(amount) {
    for (let i = 0; i < amount; i++) {
        if (Gun > 0) {
            soldiers += 1;
            Gun -= 1;
            updateDisplay();
        }
    }
}


function updatePrice() {
    soldierPrice = parseFloat(document.getElementById('price-input').value);
    updateDisplay();
}

function sellSoldiers() {
    // Calculate sell rate with fractional values
    let sellRate = baseSellRate / (1 + soldierPrice * pricePenalty * 10);

    // Adjust sell rate based on marketing level
    sellRate *= 2**marketingLevel;

    // Check if we have soldiers to sell
    if (soldiers > 0) {
        let soldiersSold = 0;
        
        // Use sellRate as a probability if it's less than 1
        if (sellRate < 1) {
            let chance = Math.random();
            if (chance < sellRate) {
                soldiersSold = 1;
            }
        } else {
            // Round down the number of soldiers to sell based on sellRate
            soldiersSold = Math.floor(sellRate);
            soldiersSold = Math.min(soldiersSold, soldiers); // Ensure we don't sell more than we have
        }
        
        if (soldiersSold > 0) {
            soldiers -= soldiersSold;
            money += soldiersSold * soldierPrice;
            updateDisplay();
            console.log(`Sold ${soldiersSold} soldiers. Remaining Soldiers: ${soldiers}`); // Log sold soldiers
        }
    }
    console.log(`Soldier Price: $${soldierPrice}, Sell Rate: ${sellRate}`);

}
function buyGun() {
    if (money >= GunPrice) {
        money -= GunPrice;
        Gun += 2**(GunUpgradeLevel-1);
        updateDisplay();
    }
}

function updateGunPrice() {
    GunPrice = Math.floor(Math.random() * 26) + 5; // Randomize price between $5 and $30
    // console.log(`New Gun Price: $${GunPrice}`);
    addMessage(`New Gun Price: $${GunPrice}`);
    updateDisplay();
}

function startGunPriceChange() {
    updateGunPrice();
    GunPriceInterval = setInterval(() => {
        updateGunPrice();
    }, GunPriceChangeIntervalMin + Math.random() * (GunPriceChangeIntervalMax - GunPriceChangeIntervalMin));
}

function buyMarketing() {
    let marketingCost = 50 * 2**marketingLevel;
    if (money >= marketingCost) {
        money -= marketingCost;
        marketingLevel += 1;
        updateDisplay();
    }
}

function buyAutomation() {
    let automationCost = automationCostBase * Math.pow(automationCostScale, automationLevel);
    if (money >= automationCost) {
        money -= automationCost;
        automationLevel += 1;
        updateDisplay();

        if (soldierProductionInterval) {
            clearInterval(soldierProductionInterval);
        }
        startAutomation();
    }
}

function startAutomation() {
    soldierProductionInterval = setInterval(() => produceSoldier(automationLevel ), 1000);
}

function buyGunUpgrade() {
    if (money >= GunUpgradeCost) {
        money -= GunUpgradeCost;
        GunUpgradeCost *= 2.5;
        GunUpgradeLevel += 1;
        updateDisplay();
    }
}
function startSelling() {
    soldierSellInterval = setInterval(sellSoldiers, 500); // Sell soldiers every second
}

function increaseOdds() {
    if (money >= oddsCost && odds < 0.4) {  // Corrected the parentheses
        odds += 0.01;
        money -= oddsCost;
        oddsCost *= 1.5;
        addMessage(`Increased odds of winning by: ${(odds * 100).toFixed(2)}%`);
        updateDisplay();
        updateOddsButton();
    }
}


const warOptions = {
    low: { risk: 0.4-odds, rewardMultiplier: 1.2 },
    medium: { risk: 0.7-odds, rewardMultiplier: 1.5 },
    high: { risk: 0.95-odds, rewardMultiplier: 2 },
};

const maxMessages = 5;
const messageBox = document.getElementById('message-box');

// Function to add messages with specific formatting
function addMessage(message) {
    const newMessage = document.createElement('p');
    newMessage.innerHTML = `&gt; ${message} <span class="insertion-point">|</span>`; // New message with '>' and insertion point

    // Update previous messages to start with ". " and remove insertion points
    Array.from(messageBox.children).forEach(child => {
        if (child.textContent.startsWith('>')) {
            child.innerHTML = `. ${child.textContent.substring(2).trim()}`; // Replace '>' with '. ' and clear any innerHTML formatting
        }
       
        child.innerHTML = child.innerHTML.replace('|', '');
        

        const insertionPoint = child.querySelector('.insertion-point');
        if (insertionPoint) {
            insertionPoint.remove(); // Ensure the insertion point is fully removed
        }
    });

    // Add the new message at the top
    messageBox.insertBefore(newMessage, messageBox.firstChild);

    // Remove the oldest message if there are more than maxMessages
    if (messageBox.children.length > maxMessages) {
        messageBox.removeChild(messageBox.lastChild);
    }

    // Scroll to the bottom of the message box
    messageBox.scrollTop = messageBox.scrollHeight;
}



function startWar(riskLevel) {
    const betAmount = parseFloat(document.getElementById('war-bet-input').value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
        addMessage("Invalid bet amount. ");
        return;
    }

    if (soldiers < 5) {
        addMessage("You need at least 5 soldiers to participate in the war. ");
        return;
    }

    const { risk, rewardMultiplier } = warOptions[riskLevel];
    const win = Math.random() > risk-odds; // Adjusted win probability based on odds
    addMessage(`You are participating in a ${riskLevel} risk infiltration with a bet of ${"$"+betAmount} and odds of ${(1-(risk-odds))*100}%.`);

    if (win) {
        // Win scenario
        money += betAmount * (rewardMultiplier - 1);
        addMessage(`You won! Your ${"$"+betAmount} has been multiplied by ${rewardMultiplier}.`);
    } else {
        // Lose scenario
        money -= betAmount;
        soldiers -= 5; 
        addMessage(`You lost! You have lost ${"$"+betAmount} and 5 soldiers. `);
    }

    updateDisplay();
}








function saveGame() {
    localStorage.setItem('soldiers', soldiers);
    localStorage.setItem('soldierPrice', soldierPrice);
    localStorage.setItem('money', money);
    localStorage.setItem('Gun', Gun);
    localStorage.setItem('GunPrice', GunPrice);
    localStorage.setItem('automationLevel', automationLevel);
    localStorage.setItem('marketingLevel', marketingLevel);
    localStorage.setItem('GunUpgradeLevel', GunUpgradeLevel);
    localStorage.setItem('odds', odds);
    localStorage.setItem('oddsCost', oddsCost);
    console.log("Game saved successfully."); // Log save action

}

function loadGame() {
    soldiers = parseInt(localStorage.getItem('soldiers')) || 0;
    soldierPrice = parseFloat(localStorage.getItem('soldierPrice')) || 10;
    money = parseFloat(localStorage.getItem('money')) || 0;
    Gun = parseInt(localStorage.getItem('Gun')) || 10; // Default Gun value
    GunPrice = parseInt(localStorage.getItem('GunPrice')) || 10; // Default Gun Price
    automationLevel = parseInt(localStorage.getItem('automationLevel')) || 0;
    marketingLevel = parseInt(localStorage.getItem('marketingLevel')) || 1; // Default Marketing Level
    GunUpgradeLevel = parseInt(localStorage.getItem('GunUpgradeLevel')) || 1; // Default Gun Upgrade Level
    odds = parseFloat(localStorage.getItem('odds')) || 0.0;
    oddsCost = parseFloat(localStorage.getItem('oddsCost')) || 200; // Default odds cost
}








setInterval(saveGame, 5000);
loadGame();
updateDisplay();
startSelling();
startGunPriceChange();


