let soldiers = 0;
let money = 9990;
let Gun = 10;
let GunPrice = 10;
let automationLevel = 0; // Start with no automation
let marketingLevel = 1;
let soldierProductionInterval = null;
let GunPriceInterval = null;
let soldierPrice = 10;
let GunUpgradeLevel = 1;
let GunUpgradeCost = 200;

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
    document.getElementById('money-count').textContent = `Money: $${money}`;
    document.getElementById('Gun-count').textContent = `Gun: ${Gun}`;
    document.getElementById('Gun-cost').textContent = `Current Gun Price: $${GunPrice}`;
    document.getElementById('marketing-level').textContent = `Marketing Level: ${marketingLevel} (Cost: $${50 * marketingLevel})`;

    // Disable produce button if no Gun
    document.getElementById('produce-soldier').disabled = (Gun <= 0);

    // Disable buy Gun button if not enough money
    document.getElementById('buy-Gun').disabled = (money < GunPrice);

    // Disable buy marketing button if not enough money
    document.getElementById('buy-marketing').disabled = (money < 50 * marketingLevel);

    // Disable buy automation button if not enough money
    let automationCost = automationCostBase * Math.pow(automationCostScale, automationLevel);
    document.getElementById('buy-automation').disabled = (money < automationCost);
    document.getElementById('buy-automation').textContent = `Buy Automation (Cost: $${automationCost.toFixed(2)}) - Produces ${automationLevel} soldier(s)/sec`;

    // Disable buy Gun upgrade button if not enough money
    let GunUpgradeCost = GunUpgradeBaseCost * Math.pow(GunUpgradeScale, GunUpgradeLevel);
    document.getElementById('buy-Gun-upgrade').disabled = (money < GunUpgradeCost);
    document.getElementById('Gun-upgrade-level').textContent = `Gun Upgrade Level: ${GunUpgradeLevel} (Cost: $${GunUpgradeCost})`;
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
    sellRate *= marketingLevel;

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
    console.log(`New Gun Price: $${GunPrice}`);
    updateDisplay();
}

function startGunPriceChange() {
    updateGunPrice();
    GunPriceInterval = setInterval(() => {
        updateGunPrice();
    }, GunPriceChangeIntervalMin + Math.random() * (GunPriceChangeIntervalMax - GunPriceChangeIntervalMin));
}

function buyMarketing() {
    let marketingCost = 50 * marketingLevel;
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
const warOptions = {
    low: { risk: 0.4, rewardMultiplier: 1.2 },
    medium: { risk: 0.7, rewardMultiplier: 1.5 },
    high: { risk: 0.95, rewardMultiplier: 2 },
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
    const win = Math.random() > risk;

    if (win) {
        // Win scenario
        money += betAmount * (rewardMultiplier - 1);
        addMessage(`You won! Your ${"$"+betAmount} has been multiplied by ${rewardMultiplier}.`);
    } else {
        // Lose scenario
        money -= betAmount;
        soldiers -= 5; // Example loss of 5 soldiers
        addMessage(`You lost! You have lost ${"$"+betAmount} and 5 soldiers. `);
    }

    updateDisplay();
}

updateDisplay();
startSelling();
startGunPriceChange();
