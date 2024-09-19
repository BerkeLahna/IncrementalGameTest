// Combat simulation

const canvas = document.getElementById('combatCanvas');
const context = canvas.getContext('2d');

// Soldier stats and upgrades
let playerSoldiers = [];
let enemySoldiers = [];
let bullets = [];
let baseSpeed = 0.1;
let baseCombat = 1;
let hazardRemediation = 1;
let combatSoldiers = 300;

// Reset speed and combat for each combat
let speed = baseSpeed;
let combat = baseCombat;

// Bullet class to handle shooting
class Bullet {
    constructor(x, y, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.radius = 2; // Small dot representing the bullet
        this.speed = 5;  // Bullet speed

        // Calculate angle and direction
        const deltaX = targetX - x;
        const deltaY = targetY - y;
        const distance = Math.hypot(deltaX, deltaY);
        
        // Normalize the direction
        this.directionX = (deltaX / distance) * this.speed;
        this.directionY = (deltaY / distance) * this.speed;
    }

    // Move bullet in the calculated direction
    move() {
        this.x += this.directionX;
        this.y += this.directionY;
    }

    // Check for collision with a soldier
    checkCollision(soldier) {
        const dist = Math.hypot(this.x - soldier.x, this.y - soldier.y);
        return dist <= soldier.radius; // Bullet hits soldier if distance is within the radius
    }

    // Draw bullet
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = 'red';
        context.fill();
        context.closePath();
    }
}


function drawCombat() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Move and draw player soldiers
    playerSoldiers.forEach(soldier => {
        soldier.move();
        soldier.draw(context);
    });

    // Move and draw enemy soldiers
    enemySoldiers.forEach(soldier => {
        soldier.move();
        soldier.draw(context);
    });

    // Move and draw bullets
    bullets.forEach((bullet, index) => {
        bullet.move();

        // Check for bullet collision with enemies
        enemySoldiers.forEach((enemy, enemyIndex) => {
            if (bullet.checkCollision(enemy)) {
                enemySoldiers.splice(enemyIndex, 1); // Remove enemy
                bullets.splice(index, 1); // Remove bullet
            }
        });

        // Check for bullet collision with player soldiers
        playerSoldiers.forEach((player, playerIndex) => {
            if (bullet.checkCollision(player)) {
                playerSoldiers.splice(playerIndex, 1); // Remove player soldier
                bullets.splice(index, 1); // Remove bullet
            }
        });

        bullet.draw(context); // Ensure bullets are drawn
    });

    // Check for winner after each draw cycle
    checkWinner();

    requestAnimationFrame(drawCombat); // Loop the animation
}


// Function to start combat
document.getElementById('startCombat').addEventListener('click', () => {
    winnerDeclared = false; // Reset the winner flag

    // Reset speed and combat stats
    speed = baseSpeed;
    combat = baseCombat;

    // Clear previous soldiers and bullets
    playerSoldiers = [];
    enemySoldiers = [];
    bullets = [];

    // Initialize player's soldiers
    for (let i = 0; i < combatSoldiers; i++) {
        // Randomize x within left 20% of the canvas, and random y within the canvas height
        const x = Math.random() * (canvas.width * 0.2);  // X between 0 and 20% of canvas width
        const y = Math.random() * canvas.height;  // Y between 0 and canvas height
        playerSoldiers.push(new Soldier(x, y, speed, combat, true));
    }
    // Initialize enemy soldiers
    for (let i = 0; i < Math.floor(Math.random() * 6) + combatSoldiers; i++) {
        // Randomize x within right 20% of the canvas, and random y within the canvas height
        const x = canvas.width * 0.8 + Math.random() * (canvas.width * 0.2);  // X between 80% and 100% of canvas width
        const y = Math.random() * canvas.height;  // Y between 0 and canvas height
        const enemySpeed = Math.floor(Math.random() * 6)/10 + speed;  // Random speed for enemies
        const enemyCombat = Math.floor(Math.random() * 6) + combat;  // Random combat for enemies
        enemySoldiers.push(new Soldier(x, y, enemySpeed, enemyCombat, false));
    }


    // Start drawing the soldiers
    drawCombat();
});



function checkWinner() {
    if (!winnerDeclared) {
    if (playerSoldiers.length === 0 && enemySoldiers.length > 0) {
        setTimeout(() => {
            if (enemySoldiers.length === 0) {
                addMessage("It's a draw! All soldiers are defeated.");
            }
            else {
                addMessage("You Lost!");
            }
        }, 100);
        winnerDeclared = true;

    } else if (enemySoldiers.length === 0 && playerSoldiers.length > 0) {
        setTimeout(() => {
            if (playerSoldiers.length === 0) {
                addMessage("It's a draw! All soldiers are defeated.");
            }
            else {
                addMessage("You win!");
            }
        }, 100);
        winnerDeclared = true; 

    } else if (playerSoldiers.length === 0 && enemySoldiers.length === 0) {
        addMessage("It's a draw!");
        winnerDeclared = true; 

    }
}

}

// Upgrade soldiers
function upgrade(type) {
    switch (type) {
        case 'speed':
            baseSpeed += 1;
            playerSoldiers.forEach(s => s.speed = baseSpeed);
            document.getElementById('speed-level').textContent = baseSpeed;
            break;
        case 'combat':
            baseCombat += 1;
            playerSoldiers.forEach(s => s.combat = baseCombat);
            document.getElementById('combat-level').textContent = baseCombat;
            break;
        case 'hazard':
            hazardRemediation += 1;
            document.getElementById('hazard-level').textContent = hazardRemediation;
            break;
        case 'soldiers':
            combatSoldiers += 1;
            document.getElementById('replication-level').textContent = combatSoldiers;
            break;
    }
}

// Soldier class
class Soldier {
    constructor(x, y, speed, combat, isPlayer) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.combat = combat;
        this.isPlayer = isPlayer;
        this.radius = 3; // Size of the soldier
        this.color = isPlayer ? 'white' : 'black'; // Player's soldiers are white, enemies are black
        this.reloadTime = 1000; // 1 second reload time
        this.lastShot = Date.now();
    }

    // Move soldier
    move() {
        // Move soldiers toward each other only if they haven't reached the middle
        if (this.isPlayer && this.x < canvas.width / 2 - 20) {
            this.x += this.speed;
        } else if (!this.isPlayer && this.x > canvas.width / 2 + 20) {
            this.x -= this.speed;
        }

        // Shooting logic
        if (Date.now() - this.lastShot >= this.reloadTime) {
            this.shoot();
            this.lastShot = Date.now();
        }
    }

    // Shoot a bullet
    shoot() {
    // Find the closest enemy soldier
    let closestEnemy = null;
    let closestDistance = Infinity;

    const soldiers = this.isPlayer ? enemySoldiers : playerSoldiers;

    soldiers.forEach((soldier) => {
        const distance = Math.hypot(soldier.x - this.x, soldier.y - this.y);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestEnemy = soldier;
        }
    });

    // If a closest enemy soldier is found, shoot towards it
    if (closestEnemy) {
        const bulletX = this.x; // Start bullet at the current soldier's x position
        const bulletY = this.y; // Start bullet at the current soldier's y position
        bullets.push(new Bullet(bulletX, bulletY, closestEnemy.x, closestEnemy.y)); // Shoot towards the closest enemy
    }
}



    // Draw soldier on canvas
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}

// Main game loop
function gameLoop() {
    updateSoldiers();
    render();
    requestAnimationFrame(gameLoop);
}
