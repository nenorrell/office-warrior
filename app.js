// app.js

// Global Variables
const gridWidth = 5;
const gridHeight = 4;
let gameGrid = [];
let playerPosition = { x: 0, y: 0 };
let player = {};
let currentEnemies = []; // Updated to handle multiple enemies
let bossRooms = []; // Array to keep track of boss room positions

// Event Listeners
document.getElementById('start-game').addEventListener('click', startGame);

// Movement Buttons
document.getElementById('move-north').addEventListener('click', () => movePlayer('north'));
document.getElementById('move-south').addEventListener('click', () => movePlayer('south'));
document.getElementById('move-west').addEventListener('click', () => movePlayer('west'));
document.getElementById('move-east').addEventListener('click', () => movePlayer('east'));

// Close Combat Modal (Flee Button)
document.getElementById('close-combat').addEventListener('click', closeCombat);

// Take a Break Button
document.getElementById('take-break').addEventListener('click', takeBreak);

// Start Game Function
function startGame() {
  const playerName = document.getElementById('player-name').value || 'Player';
  const playerClass = document.getElementById('player-class').value;

  initializePlayer(playerName, playerClass);
  initializeGrid();
  renderGrid();
  updatePlayerStats();

  document.getElementById('character-creation').classList.add('hidden');
  document.getElementById('game-interface').classList.remove('hidden');

  // Since the starting room has no enemy, check for rest option
  checkForRestOption();
}

// Initialize Player
function initializePlayer(name, playerClass) {
  const classes = {
    'software-engineer': {
      name: 'Software Engineer',
      health: 10,
      maxHealth: 10,
      defense: 2,
      attackModifier: 3,
      skills: [
        {
          name: 'Attack with Keyboard',
          description: '1d6 + 3 damage',
          cooldown: 0,
          maxCooldown: 0,
          action: function () {
            const damage = rollDice(6) + this.attackModifier;
            const targetIndex = 0; // Default to first enemy
            dealDamageToEnemy(damage, targetIndex);
            endPlayerTurn();
          },
        },
        {
          name: 'Drink Coffee',
          description: '+1 attack for 2 turns, recover 1d6 health',
          cooldown: 0,
          maxCooldown: 3,
          action: function () {
            const heal = Math.min(rollDice(6), this.maxHealth - this.health);
            this.health += heal;
            // Apply buff
            this.buffs.push({ type: 'attack', value: 1, duration: 2 });

            // Set the skill's cooldown
            const cooldownReduction = this.cooldownReduction || 0;
            const adjustedCooldown = Math.max(this.skills[1].maxCooldown - cooldownReduction, 0);
            this.cooldowns['Drink Coffee'] = adjustedCooldown;

            combatLog(`You drink coffee, recover ${heal} health, and gain +1 attack for 2 turns.`);
            endPlayerTurn();
          },
        },
        {
          name: 'Speak in Jargon',
          description: 'Confuse enemy, they may skip next turn',
          cooldown: 0,
          maxCooldown: 2,
          action: function () {
            const playerRoll = rollDice(6);
            const enemyRoll = rollDice(4);
            const targetIndex = 0; // Default to first enemy
            if (playerRoll > enemyRoll) {
              currentEnemies[targetIndex].status = 'confused';
              currentEnemies[targetIndex].statusDuration = 2;
              combatLog('You confuse the enemy with jargon. They may skip their next turn.');
            } else {
              combatLog('Your jargon failed to confuse the enemy.');
            }

            // Set the skill's cooldown
            const cooldownReduction = this.cooldownReduction || 0;
            const adjustedCooldown = Math.max(this.skills[2].maxCooldown - cooldownReduction, 0);
            this.cooldowns['Speak in Jargon'] = adjustedCooldown;

            endPlayerTurn();
          },
        },
      ],
    },
    'sales-executive': {
      name: 'Sales Executive',
      health: 15,
      maxHealth: 15,
      defense: 5,
      attackModifier: 5,
      skills: [
        {
          name: 'Attack with Phone',
          description: '1d8 + 5 damage',
          cooldown: 0,
          maxCooldown: 0,
          action: function () {
            const damage = rollDice(8) + this.attackModifier;
            const targetIndex = 0;
            dealDamageToEnemy(damage, targetIndex);
            endPlayerTurn();
          },
        },
        {
          name: 'Close the Deal',
          description: 'Attempt to gain +3 attack next turn, but may lose turn',
          cooldown: 0,
          maxCooldown: 2,
          action: function () {
            const roll = rollDice(6);
            if (roll <= 3) {
              this.buffs.push({ type: 'attack', value: 3, duration: 2 });
              combatLog('You closed the deal! Gain +3 attack for next turn.');
            } else {
              combatLog('Failed to close the deal and lose your turn.');
              // Skip next turn
              this.debuffs.push({ type: 'skipTurn', duration: 2 });
            }

            // Set the skill's cooldown
            const cooldownReduction = this.cooldownReduction || 0;
            const adjustedCooldown = Math.max(this.skills[1].maxCooldown - cooldownReduction, 0);
            this.cooldowns['Close the Deal'] = adjustedCooldown;

            endPlayerTurn();
          },
        },
        // Implement other skills...
      ],
    },
    'accountant': {
      name: 'Accountant',
      health: 12,
      maxHealth: 12,
      defense: 3,
      attackModifier: 2,
      skills: [
        {
          name: 'Bash with calculator',
          description: '1d6 damage',
          cooldown: 0,
          maxCooldown: 0,
          action: function () {
            const damage = rollDice(6) + this.attackModifier;
            const targetIndex = 0; // Default to first enemy
            dealDamageToEnemy(damage, targetIndex);
            endPlayerTurn();
          },
        },
        {
          name: 'Energy Vampire',
          description: '1d6 damage, heal equal to damage dealt',
          cooldown: 0,
          maxCooldown: 3,
          action: function () {
            const damage = rollDice(6);
            const targetIndex = 0;
            dealDamageToEnemy(damage, targetIndex);
            const heal = Math.min(damage, this.maxHealth - this.health);
            this.health += heal;

            // Set the skill's cooldown
            const cooldownReduction = this.cooldownReduction || 0;
            const adjustedCooldown = Math.max(this.skills[0].maxCooldown - cooldownReduction, 0);
            this.cooldowns['Energy Vampire'] = adjustedCooldown;

            combatLog(`You drain energy and heal ${heal} health.`);
            endPlayerTurn();
          },
        },
        {
          name: 'Bookkeeping',
          description: '+2 defense for 2 turns',
          cooldown: 0,
          maxCooldown: 3,
          action: function () {
            this.buffs.push({ type: 'defense', value: 2, duration: 2 });

            // Set the skill's cooldown
            const cooldownReduction = this.cooldownReduction || 0;
            const adjustedCooldown = Math.max(this.skills[1].maxCooldown - cooldownReduction, 0);
            this.cooldowns['Bookkeeping'] = adjustedCooldown;

            combatLog('You focus on bookkeeping and gain +2 defense for 2 turns.');
            endPlayerTurn();
          },
        },
        // Implement other skills...
      ],
    },
  };

  player = {
    name: name,
    class: classes[playerClass],
    level: 1,
    xp: 0,
    cooldowns: {},
    buffs: [],
    debuffs: [],
    skills: classes[playerClass].skills,
    health: classes[playerClass].health,
    maxHealth: classes[playerClass].maxHealth,
    baseDefense: classes[playerClass].defense,
    defense: classes[playerClass].defense,
    baseAttackModifier: classes[playerClass].attackModifier,
    attackModifier: classes[playerClass].attackModifier,
  };
}

// Initialize Game Grid
function initializeGrid() {
  for (let i = 0; i < gridHeight; i++) {
    gameGrid[i] = [];
    for (let j = 0; j < gridWidth; j++) {
      // Determine if this room should be a boss room
      const isBossRoom = (i * gridWidth + j + 1) % 3 === 0; // Every 3rd room
      if (isBossRoom) {
        bossRooms.push({ x: i, y: j });
      }

      // Determine if the room should have two enemies
      const hasTwoEnemies = !isBossRoom && Math.random() < 0.2; // 20% chance for non-boss rooms

      gameGrid[i][j] = {
        explored: false,
        cleared: false,
        enemies: isBossRoom
          ? [generateBoss()]
          : hasTwoEnemies
          ? [generateEnemy(), generateEnemy()]
          : [generateEnemy()],
      };

      // Assign room type for rendering
      if (isBossRoom) {
        gameGrid[i][j].roomType = 'boss';
      } else if (hasTwoEnemies) {
        gameGrid[i][j].roomType = 'double-enemy';
      } else {
        gameGrid[i][j].roomType = 'regular';
      }
    }
  }

  // Ensure the starting room has no enemy
  gameGrid[playerPosition.x][playerPosition.y].enemies = [];
  gameGrid[playerPosition.x][playerPosition.y].cleared = true;
  gameGrid[playerPosition.x][playerPosition.y].explored = true;
}

// Generate Regular Enemy
function generateEnemy() {
  const enemyTypes = ['Intern', 'Manager', 'Director'];
  const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  return {
    type: 'enemy',
    name: enemyType,
    health: 8,
    maxHealth: 8,
    defense: 2,
    attackModifier: 2,
    status: null,
    statusDuration: 0,
  };
}

// Generate Boss Enemy
function generateBoss() {
  const bosses = [
    {
      type: 'boss',
      name: 'The CEO',
      health: 30,
      maxHealth: 30,
      defense: 6,
      attackModifier: 6,
      phase: 1,
      status: null,
      statusDuration: 0,
      skills: [
        'cutTheBudget',
        'firingSpree',
        'corporateRestructure',
        'rallyTheTroops',
      ],
    },
    {
      type: 'boss',
      name: 'The HR Manager',
      health: 25,
      maxHealth: 25,
      defense: 5,
      attackModifier: 4,
      phase: 1,
      status: null,
      statusDuration: 0,
      skills: [
        'enforcePolicy',
        'mandatoryTraining',
        'teamBuildingExercise',
        'conflictResolution',
      ],
    },
    {
      type: 'boss',
      name: 'The CFO',
      health: 28,
      maxHealth: 28,
      defense: 7,
      attackModifier: 5,
      phase: 1,
      status: null,
      statusDuration: 0,
      skills: [
        'cashFlowDrain',
        'taxAudit',
        'budgetCut',
        'goldenParachute',
      ],
    },
  ];

  // Randomly select a boss
  return bosses[Math.floor(Math.random() * bosses.length)];
}

// Render Game Grid
function renderGrid() {
  const gridContainer = document.getElementById('game-grid');
  gridContainer.innerHTML = '';
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      const cell = document.createElement('div');
      cell.classList.add(
        'w-12',
        'h-12',
        'border',
        'border-gray-400',
        'relative',
        'flex',
        'items-center',
        'justify-center'
      );

      const room = gameGrid[i][j];
      const isBossRoom = room.roomType === 'boss';
      const hasTwoEnemies = room.roomType === 'double-enemy';

      if (playerPosition.x === i && playerPosition.y === j) {
        // Player's current position
        cell.classList.add('bg-blue-500');
      } else if (isBossRoom) {
        // Boss room
        cell.classList.add('bg-red-500');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-skull-crossbones', 'text-white', 'text-xl');
        cell.appendChild(icon);
      } else if (hasTwoEnemies) {
        // Room with two enemies
        cell.classList.add('bg-purple-300');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-users', 'text-white', 'text-xl');
        cell.appendChild(icon);
      } else if (room.cleared) {
        // Cleared room
        cell.classList.add('bg-green-300');
      } else if (room.explored) {
        // Explored room
        cell.classList.add('bg-gray-300');
      } else {
        // Unexplored room
        cell.classList.add('bg-gray-100');
      }

      gridContainer.appendChild(cell);
    }
  }
}

// Move Player
function movePlayer(direction) {
  let { x, y } = playerPosition;

  // Check if current room is cleared before allowing movement
  const currentRoom = gameGrid[playerPosition.x][playerPosition.y];
  if (!currentRoom.cleared && currentRoom.enemies.length > 0) {
    combatLog('You must defeat the enemies before leaving the room.');
    return;
  }

  if (direction === 'north' && x > 0) x--;
  if (direction === 'south' && x < gridHeight - 1) x++;
  if (direction === 'west' && y > 0) y--;
  if (direction === 'east' && y < gridWidth - 1) y++;

  playerPosition = { x, y };
  renderGrid();
  enterRoom();
}

// Enter Room
function enterRoom() {
  const room = gameGrid[playerPosition.x][playerPosition.y];
  if (!room.explored) {
    room.explored = true;

    // Check if this is a boss room
    if (room.roomType === 'boss') {
      combatLog(`Warning: You are about to face ${room.enemies[0].name}! Prepare yourself.`);
      // Allow the player to take a break before the boss fight
      document.getElementById('take-break').classList.remove('hidden');
    }

    currentEnemies = room.enemies.slice(); // Copy the enemies array

    if (currentEnemies.length > 0) {
      initiateCombat();
    } else {
      room.cleared = true; // No enemies mean room is cleared
      checkForRestOption();
    }
  } else {
    checkForRestOption();
  }
}

// Check if player can take a break
function checkForRestOption() {
  const room = gameGrid[playerPosition.x][playerPosition.y];
  if (room.cleared) {
    document.getElementById('take-break').classList.remove('hidden');
  } else {
    document.getElementById('take-break').classList.add('hidden');
  }
}

// Take a Break
function takeBreak() {
  player.health = player.maxHealth;
  updatePlayerStats();
  combatLog('You take a break and restore your health fully.');
  // Hide the button after taking a break
  document.getElementById('take-break').classList.add('hidden');
}

// Combat System
function initiateCombat() {
  // Show the modal
  document.getElementById('combat-modal').classList.remove('hidden');
  // Set the current enemy to the first in the array
  currentEnemy = currentEnemies.shift();
  updateEnemyStats();
  updateModalPlayerStats();
  generateActionButtons();
  combatLog(`You encounter a ${currentEnemy.name}!`);

  // Apply environmental effects if any (for bosses)
  if (currentEnemy.type === 'boss') {
    applyEnvironmentalEffects();
  }
}

// Apply Environmental Effects
function applyEnvironmentalEffects() {
  const boss = currentEnemies.find((enemy) => enemy.type === 'boss');
  if (boss.name === 'The CEO') {
    combatLog('Environmental Effect: Low Morale - Your attack modifier is reduced by 1.');
    player.attackModifier -= 1;
  } else if (boss.name === 'The HR Manager') {
    combatLog('Environmental Effect: Overtime - You take 1 damage each turn due to fatigue.');
    player.debuffs.push({ type: 'damageOverTime', value: 1, duration: Infinity });
  }
  // Add more environmental effects as needed
}

// Close Combat Modal (Flee from battle)
function closeCombat() {
  const room = gameGrid[playerPosition.x][playerPosition.y];

  // Check if the enemy is a boss
  if (currentEnemy.type === 'boss') {
    combatLog('You cannot flee from this battle!');
    return;
  } else {
    // Player flees successfully
    combatLog('You flee from the battle.');
    document.getElementById('combat-modal').classList.add('hidden');
    // Put the current enemy back into the array
    currentEnemies.unshift(currentEnemy);
    currentEnemy = null;
  }
}

// Update Player Stats (Main Screen)
function updatePlayerStats() {
  document.getElementById('player-info').innerText = `
    Name: ${player.name}
    Class: ${player.class.name}
    Level: ${player.level}
    Health: ${player.health}/${player.maxHealth}
    Defense: ${player.defense}
    Attack Modifier: ${player.attackModifier}
    XP: ${player.xp}
  `;
}

// Update Player Stats (Modal)
function updateModalPlayerStats() {
  document.getElementById('modal-player-stats').innerText = `
    Name: ${player.name}
    Class: ${player.class.name}
    Level: ${player.level}
    Health: ${player.health}/${player.maxHealth}
    Defense: ${player.defense}
    Attack Modifier: ${player.attackModifier}
  `;
}

// Update Enemy Stats
function updateEnemyStats() {
  const enemyStatsDiv = document.getElementById('enemy-stats');
  enemyStatsDiv.innerHTML = `
    Enemy: ${currentEnemy.name}
    Health: ${currentEnemy.health}/${currentEnemy.maxHealth}
    Defense: ${currentEnemy.defense}
  `;
}

// Generate Action Buttons
function generateActionButtons() {
  const actionsContainer = document.getElementById('actions');
  actionsContainer.innerHTML = '';

  player.skills.forEach((skill) => {
    const button = document.createElement('button');

    // Check if the skill is on cooldown
    const cooldown = player.cooldowns[skill.name] || 0;
    const isOnCooldown = cooldown > 0;

    if (isOnCooldown) {
      // Show cooldown counter in button text
      button.innerText = `${skill.name} (Cooldown - ${cooldown})`;
      button.disabled = true;
      button.classList.add('bg-gray-500', 'text-white', 'p-2', 'm-1', 'rounded', 'cursor-not-allowed');
    } else {
      button.innerText = skill.name;
      button.title = skill.description;
      button.disabled = false;
      button.classList.add('bg-blue-500', 'text-white', 'p-2', 'm-1', 'rounded', 'hover:bg-blue-700');
      button.addEventListener('click', () => {
        skill.action.call(player);
      });
    }

    actionsContainer.appendChild(button);
  });
}

// Combat Log
function combatLog(message) {
  const mainLog = document.getElementById('main-combat-log');
  const modalLog = document.getElementById('modal-combat-log');

  mainLog.innerHTML += `<p>${message}</p>`;
  mainLog.scrollTop = mainLog.scrollHeight;

  modalLog.innerHTML += `<p>${message}</p>`;
  modalLog.scrollTop = modalLog.scrollHeight;
}

// Deal Damage to Enemy
function dealDamageToEnemy(damage) {
  const actualDamage = Math.max(damage - currentEnemy.defense, 0);
  currentEnemy.health -= actualDamage;
  combatLog(`You deal ${actualDamage} damage to ${currentEnemy.name}.`);
}

// Enemy Turn
function enemyTurn() {
  if (!currentEnemy) return;

  if (currentEnemy.status === 'confused' && currentEnemy.statusDuration > 0) {
    combatLog(`${currentEnemy.name} is confused and skips their turn.`);
    currentEnemy.statusDuration--;
    return;
  }

  if (currentEnemy.type === 'boss') {
    bossAction(currentEnemy);
  } else {
    regularEnemyAction(currentEnemy);
  }

  if (player.health <= 0) {
    combatLog('You have been defeated!');
    endGame();
  }
}

// Regular Enemy Action
function regularEnemyAction(enemy) {
  const damage = rollDice(6) + enemy.attackModifier;
  const actualDamage = Math.max(damage - player.defense, 0);
  player.health -= actualDamage;
  combatLog(`${enemy.name} attacks and deals ${actualDamage} damage.`);
}

// Boss Action
function bossAction(boss) {
  // Boss uses a skill randomly
  const skillName = boss.skills[Math.floor(Math.random() * boss.skills.length)];
  bossSkills[skillName](boss);
}

// Boss Skills
const bossSkills = {
  // CEO Skills
  cutTheBudget: function () {
    const roll = rollDice(6);
    if (roll >= 4) {
      player.defense = Math.max(player.defense - 2, 0);
      combatLog('The CEO uses Cut the Budget! Your defense is reduced by 2 for 3 turns.');
      player.debuffs.push({ type: 'defenseDown', value: 2, duration: 3 });
    } else {
      combatLog('The CEO attempts to Cut the Budget but fails.');
    }
  },
  firingSpree: function () {
    const roll = rollDice(6);
    if (roll >= 4) {
      const damage = rollDice(6) + rollDice(6);
      const actualDamage = Math.max(damage - player.defense, 0);
      player.health -= actualDamage;
      combatLog(`The CEO uses Firing Spree and deals ${actualDamage} damage.`);
    } else {
      combatLog('The CEO uses Firing Spree but misses. Still, you feel the pressure.');
      player.health -= 2;
    }
  },
  corporateRestructure: function () {
    const roll = rollDice(6);
    if (roll >= 4) {
      const skillToDisable = player.skills[Math.floor(Math.random() * player.skills.length)].name;
      player.debuffs.push({ type: 'skillDisabled', skillName: skillToDisable, duration: 2 });
      combatLog(`The CEO uses Corporate Restructure! Your ${skillToDisable} skill is disabled for 2 turns.`);
    } else {
      combatLog('The CEO attempts Corporate Restructure but fails.');
    }
  },
  rallyTheTroops: function () {
    if (currentEnemy.phase === 1 && currentEnemy.health <= currentEnemy.maxHealth / 2) {
      currentEnemy.phase = 2;
      combatLog('The CEO uses Rally the Troops! Summoning two Interns.');
      // Summon two Interns
      const intern1 = generateEnemy();
      const intern2 = generateEnemy();
      intern1.name = 'Intern';
      intern2.name = 'Intern';
      intern1.health = 10;
      intern2.health = 10;
      // Add interns to the currentEnemy's allies
      currentEnemy.allies = [intern1, intern2];
    }
  },
  // HR Manager Skills
  enforcePolicy: function () {
    const damage = rollDice(8);
    const actualDamage = Math.max(damage - player.defense, 0);
    player.health -= actualDamage;
    combatLog(`The HR Manager uses Enforce Policy and deals ${actualDamage} damage.`);
    if (damage === 8) {
      player.attackModifier -= 2;
      combatLog('Critical enforcement! Your attack is reduced by 2 for 2 turns.');
      player.debuffs.push({ type: 'attackDown', value: 2, duration: 2 });
    }
  },
  mandatoryTraining: function () {
    const roll = rollDice(6);
    if (roll >= 4) {
      combatLog('The HR Manager uses Mandatory Training! You skip your next turn.');
      player.debuffs.push({ type: 'skipTurn', duration: 2 });
    } else {
      combatLog('The HR Manager attempts Mandatory Training but you avoid it.');
    }
  },
  teamBuildingExercise: function () {
    if (currentEnemy.health <= currentEnemy.maxHealth / 2) {
      const heal = rollDice(6);
      currentEnemy.health = Math.min(currentEnemy.health + heal, currentEnemy.maxHealth);
      combatLog(`The HR Manager uses Team Building Exercise and heals for ${heal} health.`);
    }
  },
  conflictResolution: function () {
    const roll = rollDice(4);
    if (roll >= 3) {
      combatLog('The HR Manager uses Conflict Resolution! Your skill cooldowns are increased by 1 turn.');
      // Increase all skill cooldowns by 1
      for (let skillName in player.cooldowns) {
        player.cooldowns[skillName]++;
      }
    } else {
      combatLog('The HR Manager attempts Conflict Resolution but fails.');
    }
  },
  // CFO Skills
  cashFlowDrain: function () {
    const damage = rollDice(6);
    const actualDamage = Math.max(damage - player.defense, 0);
    player.health -= actualDamage;
    const healAmount = Math.floor(actualDamage / 2);
    currentEnemy.health = Math.min(currentEnemy.health + healAmount, currentEnemy.maxHealth);
    combatLog(`The CFO uses Cash Flow Drain, deals ${actualDamage} damage, and heals for ${healAmount} health.`);
  },
  taxAudit: function () {
    const playerRoll = rollDice(6);
    if (playerRoll <= 4) {
      player.attackModifier = Math.max(player.attackModifier - 3, 0);
      combatLog('The CFO uses Tax Audit! Your attack is reduced by 3 for 2 turns.');
      player.debuffs.push({ type: 'attackDown', value: 3, duration: 2 });
    } else {
      combatLog('You resist the CFO\'s Tax Audit.');
    }
  },
  budgetCut: function () {
    if (currentEnemy.health <= currentEnemy.maxHealth / 2 && currentEnemy.phase === 1) {
      currentEnemy.phase = 2;
      const damage = rollDice(4);
      player.health -= damage;
      combatLog(`The CFO uses Budget Cut! You lose ${damage} health.`);
    }
  },
  goldenParachute: function () {
    if (currentEnemy.health <= 10 && !currentEnemy.goldenParachuteUsed) {
      currentEnemy.goldenParachuteUsed = true;
      currentEnemy.immuneToDebuffs = true;
      combatLog('The CFO uses Golden Parachute! Becomes immune to debuffs for 2 turns.');
      currentEnemy.buffs = [{ type: 'immuneToDebuffs', duration: 2 }];
    }
  },
};

// Handle Buffs and Debuffs
function handleBuffsAndDebuffs() {
  // Reset to base values
  player.attackModifier = player.baseAttackModifier;
  player.defense = player.baseDefense;

  // Apply buffs
  player.buffs = player.buffs.filter((buff) => {
    if (buff.duration > 0) {
      if (buff.type === 'attack') {
        player.attackModifier += buff.value;
      } else if (buff.type === 'defense') {
        player.defense += buff.value;
      }
      buff.duration--;
      return buff.duration > 0;
    }
    return false;
  });

  // Apply debuffs
  player.debuffs = player.debuffs.filter((debuff) => {
    if (debuff.duration > 0) {
      if (debuff.type === 'attackDown') {
        player.attackModifier = Math.max(player.attackModifier - debuff.value, 0);
      } else if (debuff.type === 'defenseDown') {
        player.defense = Math.max(player.defense - debuff.value, 0);
      } else if (debuff.type === 'skipTurn') {
        player.skipNextTurn = true;
      } else if (debuff.type === 'damageOverTime') {
        player.health -= debuff.value;
        combatLog(`You take ${debuff.value} damage due to environmental effects.`);
      }
      debuff.duration--;
      return debuff.duration > 0;
    }
    return false;
  });
}

// Roll Dice Function
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// End Player Turn
function endPlayerTurn() {
  handleCooldowns();
  handleBuffsAndDebuffs();
  updatePlayerStats();
  updateModalPlayerStats();
  updateEnemyStats();

  if (currentEnemy.health <= 0) {
    combatLog(`You have defeated ${currentEnemy.name}!`);

    // Grant rewards based on enemy type
    if (currentEnemy.type === 'boss') {
      gainXP(200); // Boss XP reward
      combatLog('You found a rare item: "Company Car" - Reduces skill cooldowns by 1 turn!');
      // Apply the item effect
      player.item = 'Company Car';
      player.cooldownReduction = 1;
    } else {
      gainXP(50); // Regular enemy XP reward
    }

    if (currentEnemies.length > 0) {
      // Initiate combat with the next enemy
      currentEnemy = currentEnemies.shift();
      combatLog(`Another enemy appears: ${currentEnemy.name}!`);
      updateEnemyStats();
    } else {
      // No more enemies in the room
      currentEnemy = null;
      const room = gameGrid[playerPosition.x][playerPosition.y];
      room.cleared = true;

      // Hide the modal
      document.getElementById('combat-modal').classList.add('hidden');

      // Update grid to reflect cleared room
      renderGrid();

      // Check for rest option
      checkForRestOption();

      updatePlayerStats();
    }
  } else {
    // Check if player is supposed to skip turn
    if (player.skipNextTurn) {
      combatLog('You are unable to act this turn.');
      player.skipNextTurn = false; // Reset the skip turn flag
    } else {
      // Enemy's turn
      enemyTurn();
    }
    updatePlayerStats();
    updateModalPlayerStats();
    updateEnemyStats();
    // Refresh action buttons
    generateActionButtons();
  }
}

// Handle Cooldowns
function handleCooldowns() {
  for (let skillName in player.cooldowns) {
    if (player.cooldowns[skillName] > 0) {
      player.cooldowns[skillName]--;
      if (player.cooldowns[skillName] === 0) {
        delete player.cooldowns[skillName]; // Remove cooldown entry when it reaches zero
      }
    }
  }
}

// Gain XP
function gainXP(amount) {
  player.xp += amount;
  combatLog(`You gain ${amount} XP.`);
  checkLevelUp();
}

// Check Level Up
function checkLevelUp() {
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000];
  if (player.level < xpThresholds.length && player.xp >= xpThresholds[player.level]) {
    levelUp();
  }
}

// Level Up
function levelUp() {
  player.level++;
  player.maxHealth += 2;
  player.health = player.maxHealth;
  if (player.level % 2 === 0) {
    player.baseDefense++;
    player.defense = player.baseDefense;
  }
  player.baseAttackModifier++;
  player.attackModifier = player.baseAttackModifier;
  combatLog(`You have leveled up to level ${player.level}!`);
  updatePlayerStats();
  updateModalPlayerStats();
}

// End Game
function endGame() {
  alert('Game Over');
  location.reload();
}
