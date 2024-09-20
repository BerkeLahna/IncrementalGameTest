// Combat simulation

const canvas = document.getElementById('combatCanvas');
const context = canvas.getContext('2d');

// Soldier stats and upgrades
let playerSoldiers = [];
let enemySoldiers = [];
let bullets = [];
let baseSpeed = 1;
let baseCombat = 1;
let baseHP = 1; // Base HP for soldiers
let hazardRemediation = 1;
let combatSoldiers = 1;
let deadToHazards = 0;
let ongoingCombat = false; 

const hazardChanceBase = 0.01; // Base 10% chance of hazard damage

// Reset speed, combat, and hp for each combat
let speed = baseSpeed/10;
let combat = baseCombat;
let soldierHP = baseHP;

// Bullet class to handle shooting
class Bullet {
    constructor(x, y, targetX, targetY, damage) {
        this.x = x;
        this.y = y;
        this.radius = 2; // Small dot representing the bullet
        this.speed = 5;  // Bullet speed
        this.damage = damage || 1; // Damage dealt by the bullet

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

    bullets.forEach((bullet, index) => {
        bullet.move();
    
        // Check for bullet collision with enemies
        enemySoldiers.forEach((enemy, enemyIndex) => {
            if (bullet.checkCollision(enemy)) {
                if (enemy.hp > 0) {
                    enemy.hp -= bullet.damage; // Apply bullet's damage based on the combat level
                }
                if (enemy.hp <= 0) {
                    enemySoldiers.splice(enemyIndex, 1); // Remove enemy
                }
                bullets.splice(index, 1); // Remove bullet
            }
        });
    
        // Check for bullet collision with player soldiers
        playerSoldiers.forEach((player, playerIndex) => {
            if (bullet.checkCollision(player)) {
                if (player.hp > 0) {
                    player.hp -= bullet.damage; // Apply bullet's damage based on the combat level
                }
                if (player.hp <= 0) {
                    playerSoldiers.splice(playerIndex, 1); // Remove player soldier
                }
                bullets.splice(index, 1); // Remove bullet
            }
        });
    
        bullet.draw(context); // Ensure bullets are drawn
    });
    

    if (!winnerDeclared) {
    checkWinner();
    requestAnimationFrame(drawCombat); // Loop the animation

    }
    if (winnerDeclared) {
    bullets.length = 0;

    }

}


// Function to start combat

document.getElementById('startCombat').addEventListener('click', () => {
    if(!ongoingCombat){
    ongoingCombat = true;

    document.getElementById('startCombat').disabled = ongoingCombat;

    winnerDeclared = false; // Reset the winner flag
    deadToHazards = 0; // Reset dead to hazards count
    // Reset speed, combat stats, and HP
    speed = baseSpeed/10;
    combat = baseCombat;
    soldierHP = baseHP;

    // Clear previous soldiers and bullets
    playerSoldiers = [];
    enemySoldiers = [];
    bullets = [];

    // Initialize player's soldiers
    for (let i = 0; i < combatSoldiers; i++) {
        // Randomize x within left 20% of the canvas, and random y within the canvas height
        const x = Math.random() * (canvas.width * 0.2);  // X between 0 and 20% of canvas width
        const y = Math.random() * canvas.height;  // Y between 0 and canvas height
        playerSoldiers.push(new Soldier(x, y, speed, combat, soldierHP, true));
    }
    
    // Initialize enemy soldiers
    for (let i = 0; i < Math.floor(Math.random() * 6) + combatSoldiers; i++) {
        const x = canvas.width * 0.8 + Math.random() * (canvas.width * 0.2);  // X between 80% and 100% of canvas width
        const y = Math.random() * canvas.height;  // Y between 0 and canvas height

        // Ensure enemySpeed is within -5 and +5 of player's speed, but never less than 1
        let enemySpeed = speed + Math.floor(Math.random() * 11) - 5; // Generate a value between -5 and +5
        if (enemySpeed < 1) {
            enemySpeed = 1; // Ensure enemy speed is never below 1
        }

        // Ensure enemyCombat is within -5 and +5 of player's combat level, but never less than 1
        let enemyCombat = combat + Math.floor(Math.random() * 11) - 5; // Generate a value between -5 and +5
        if (enemyCombat < 1) {
            enemyCombat = 1; // Ensure enemy combat level is never below 1
        }

        // Ensure enemyHP is within -5 and +5 of player's HP, but never less than 1
        let enemyHP = baseHP + Math.floor(Math.random() * 11) - 5; // Generate a value between -5 and +5
        if (enemyHP < 1) {
            enemyHP = 1; // Ensure enemy HP is never below 1
        }

        // Create and add the enemy soldier to the array
        enemySoldiers.push(new Soldier(x, y, enemySpeed, enemyCombat, enemyHP, false));
    }


    // Start drawing the soldiers
    drawCombat();}

});


function checkWinner() {
    if (!winnerDeclared) {
    if (playerSoldiers.length === 0 && enemySoldiers.length > 0) {
        setTimeout(() => {
            if (enemySoldiers.length === 0) {
                addMessage("It's a draw! All soldiers are defeated. Soldiers dead to hazards: " + deadToHazards);
            }
            else {
                addMessage("You Lost! Soldiers dead to hazards: " + deadToHazards);
            }
        }, 200);
        winnerDeclared = true;

    } else if (enemySoldiers.length === 0 && playerSoldiers.length > 0) {
        setTimeout(() => {
            if (playerSoldiers.length === 0) {
                addMessage("It's a draw! All soldiers are defeated. Soldiers dead to hazards: " + deadToHazards);
            }
            else {
                addMessage("You win! Soldiers dead to hazards: " + deadToHazards);
            }
        }, 200);
        winnerDeclared = true; 


    } else if (playerSoldiers.length === 0 && enemySoldiers.length === 0) {
        addMessage("It's a draw!");
        winnerDeclared = true; 


    }
}
if (winnerDeclared) {
    ongoingCombat = false;
    document.getElementById('startCombat').disabled = ongoingCombat;

}
}

// Upgrade logic
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
        case 'hp':
            baseHP += 1;  
            playerSoldiers.forEach(s => s.hp = baseHP);
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
}

// Soldier class
class Soldier {
    constructor(x, y, speed, combat, hp, isPlayer) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.combat = combat;
        this.hp = hp; // Initialize HP
        this.isPlayer = isPlayer;
        this.radius = 3; // Size of the soldier
        this.color = isPlayer ? 'white' : 'black'; // Player's soldiers are white, enemies are black
        this.reloadTime = 1000; // 1 second reload time
        this.lastShot = Date.now();
    }

    // Move soldier and apply hazard chance
    move() {
        let isMoving = false;
    
        // Move soldiers toward each other only if they haven't reached the middle
        if (this.isPlayer && this.x < canvas.width / 2 - 20) {
            this.x += this.speed;
            isMoving = true; // The soldier is moving
        } else if (!this.isPlayer && this.x > canvas.width / 2 + 20) {
            this.x -= this.speed;
            isMoving = true; // The soldier is moving
        }
    
        // Hazard chance of taking 1 damage only if the soldier is moving
        if (isMoving) {
            const hazardChance = hazardChanceBase / hazardRemediation; // Reduce chance by hazardRemediation
            if (Math.random() < hazardChance) {
                this.hp -= 1;
                if (this.hp <= 0) {
                    // Remove soldier if HP drops to 0
                    const soldiers = this.isPlayer ? playerSoldiers : enemySoldiers;
                    const index = soldiers.indexOf(this);
                    if (index !== -1) {
                        soldiers.splice(index, 1);
                    }
                    if (this.isPlayer) {
                    deadToHazards += 1;
                    }
                }
            }
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
            bullets.push(new Bullet(bulletX, bulletY, closestEnemy.x, closestEnemy.y, this.combat)); // Use soldier's combat as damage
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


