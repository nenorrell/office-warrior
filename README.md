Base prompt used:

```
Let's make a browser based text RPG game called "Office warrior". The game is a satirical take on corporate world. The UI should use Tailwind CSS for styling.

### Combat rules

Combat System Overview:
Here’s a simple combat system based on these stats and abilities:

Turn Order:

Players and enemies take turns.
On each player’s turn, they can choose to attack with their basic attack or use one of their abilities (if available).
Attacking:

Basic attack: Roll the appropriate dice for damage based on the class (e.g., Software Engineer rolls 1d6 for “Attack with keyboard”).
Modifiers: Each class has an attack modifier (e.g., Software Engineer +3). Add this to the damage roll.
Defense: Subtract the enemy's defense from the damage dealt.
Skill Usage:

Players can use a skill once per turn unless it’s on cooldown.

Cooldowns:
For skills with long-term effects (like buffs or debuffs), keep track of the remaining turns before they can be used again.
For example, if “Drink Coffee” gives a buff for 2 turns, it cannot be used again until the buff expires.
Resisting Skills:

When an ability calls for an enemy to resist (e.g., "Speak in jargon" or "Audit"), the enemy rolls their respective dice (e.g., 1d6 for jargon resistance or 1d4) and compares it to the player’s roll.
If the player rolls higher, the skill effect happens.
If the enemy rolls higher, the skill fails.
Winning:

The goal is to reduce the enemy's health to zero by utilizing a combination of attacks and skills.
Players win when the enemy's health reaches 0, and lose if their health reaches 0.
Sample Combat Flow:
Player’s Turn:

Player (Software Engineer) chooses “Attack with keyboard.”
Player rolls 1d6 for attack. Result: 4
Attack modifier is +3, so total damage = 4 + 3 = 7
Enemy has defense 3, so actual damage dealt = 7 - 3 = 4.
Enemy health is reduced by 4.
Enemy’s Turn:

Enemy attacks, rolls damage, subtracts player’s defense, and reduces player’s health.
Player’s Turn:

Player chooses “Drink coffee,” gaining +1 to attack for the next 2 turns and recovers 1d3 health.
This system ensures a tactical and fun experience, with opportunities for players to decide between pure attacks or using their class skills to gain an advantage.


### Classes

The play can choose between 3 classes:

# **Software Engineer (Mage)**

- **Health**: 10
- **Defense**: 2
- **Attack Modifier**: +3

### Skills:
1. **Attack with Keyboard**: 
    - 1d6 roll for damage.
    - Add +3 attack modifier.

2. **Drink Coffee**: 
    - Gain +1 to attack for 2 turns.
    - Recover 1d3 health.
    - Cooldown: 3 turns.

3. **Speak in Jargon**: 
    - Roll 1d6 to confuse enemy (enemy rolls 1d4 to resist).
    - If successful, enemy skips their next turn.
    - Cooldown: 2 turns.

---

# **Sales Executive (Warrior)**

- **Health**: 15
- **Defense**: 5
- **Attack Modifier**: +5


### Skills:
1. **Attack with Phone**: 
    - 1d8 roll for damage.
    - Add +5 attack modifier.

2. **Close the Deal**: 
    - Roll 1d6 to see if you can close the deal.
        - 1-3: Deal closed, gain +3 to attack for the next turn.
        - 4-6: Deal not closed, lose turn.
    - Cooldown: 2 turns.

3. **Overpromise**: 
    - Roll 1d6 to subtract from enemy's attack (enemy attack reduced for 3 turns).
    - Cooldown: 4 turns.

---

# **Accountant (Lich)**

- **Health**: 12
- **Defense**: 3
- **Attack Modifier**: +2

### Skills:
1. **Energy Vampire**: 
    - 1d6 roll for damage.
    - Add the dealt damage to your health (health max: 15).
    - Cooldown: 3 turns.

2. **Bookkeeping**: 
    - +2 to defense for 2 turns.
    - Cooldown: 3 turns.

3. **Audit**: 
    - Roll 1d6 to reduce enemy's attack by 3 for 2 turns (enemy rolls 1d6 to resist).
    - Cooldown: 3 turns.

### Level Modifier System Overview:
Health Growth:

Every level increases a class's base health by a set amount (e.g., +2 HP per level).
Defense Growth:

Every 2 levels, the class gains +1 to their base defense.
Attack Modifier Growth:

Every level increases the attack modifier by +1, making attacks more powerful.
Skill Scaling:

Some skills can have increased potency with level (e.g., damage, healing, or buff durations).
Ability Unlocks/Upgrades: At specific levels (e.g., level 5 or 10), certain abilities can unlock new effects or improve existing ones.

Here’s an example of XP thresholds using an increasing XP requirement formula:

Level 1 to 2: 100 XP
Level 2 to 3: 250 XP
Level 3 to 4: 500 XP
Level 4 to 5: 1000 XP
Level 5 to 6: 2000 XP
Level 6 to 7: 3500 XP
Level 7 to 8: 5000 XP
Level 8 to 9: 7500 XP
Level 9 to 10: 10000 XP

### How XP is Gained:
- **Defeating Enemies**: The main source of XP. Each enemy grants a certain amount of XP based on its difficulty.
- **Completing Quests/Tasks**: Optional but significant sources of XP.
- **Other Achievements**: Bonus XP can be awarded for specific milestones, such as using skills effectively or overcoming challenges.


### Game setup
You start the game by choosing a class and naming your character. The game then starts with you in your office. Office is a 5x4 grid with different rooms. You fight waves of enemies in different rooms. Each room has a different enemy. You can move between rooms and fight enemies. Once you defeat all enemies in a room, you can move to the next room. The game ends when you defeat all enemies in all rooms. The enemies will be no greater level than 2 levels above the player's level. If a player dies, the game ends. At the end of each room, the player will gain the total sum of XP from all enemies defeated in that room. At the end of each room, if the player has reached the next level threshold, they will level up and gain new abilities. Their health will also be restored to full and any cooldowns or debuffs will be removed.


# Boss Fight Mechanics

## Boss Encounter Setup
- **Placement**: Every 3rd or 5th room on the grid contains a boss encounter.
- **Unique Abilities**: Bosses will have unique skills that are harder to counter than regular enemies.
- **Rewards**: Defeating a boss grants a significant amount of XP and special items or bonuses (e.g., temporary skill cooldown reduction, health potions, or stat boosts).

## Boss Characteristics
1. **Higher Health & Defense**: Bosses have higher health, defense, and attack modifiers than regular enemies.
2. **Multiple Phases**: Bosses can have phases where, after losing a certain percentage of health, they unlock new abilities or boost their stats.
3. **Unique Skills**: Bosses will have corporate-themed skills that mirror their roles.
4. **Environmental Effects**: Some boss rooms may have environmental modifiers like:
   - **Low Morale**: Players’ attack modifiers are reduced by 1.
   - **Overtime**: Players take 1 damage each turn due to fatigue.
   - **All-Hands Meeting**: Boss can summon minions to assist in combat.

## Sample Bosses

### 1. **The CEO**
- **Health**: 30
- **Defense**: 6
- **Attack Modifier**: +6

#### Skills:
1. **Cut the Budget**: Roll 1d6. If the result is 4 or higher, the player’s defense is reduced by 2 for 3 turns.
2. **Firing Spree**: Roll 1d6. On 4-6, deal 2d6 damage. On 1-3, miss the attack.
3. **Corporate Restructure**: Roll 1d6. If 4 or higher, randomly disable one of the player’s abilities for 2 turns.
4. **Rally the Troops**: At 50% health, summon two **Intern** minions with 10 health and +2 attack modifier.

---

### 2. **The HR Manager**
- **Health**: 25
- **Defense**: 5
- **Attack Modifier**: +4

#### Skills:
1. **Enforce Policy**: Roll 1d8. Deals 1d8 damage. If the roll is an 8, the player's attack is reduced by 2 for 2 turns.
2. **Mandatory Training**: Roll 1d6. If 4 or higher, the player skips their next turn due to being "in training."
3. **Team Building Exercise**: Heals the HR Manager for 1d6 health when under 50% health.
4. **Conflict Resolution**: Roll 1d4. If 3 or higher, one player’s skill cooldown is increased by 1 turn.

---

### 3. **The CFO (Financial Tyrant)**
- **Health**: 28
- **Defense**: 7
- **Attack Modifier**: +5

#### Skills:
1. **Cash Flow Drain**: Roll 1d6. Deals 1d6 damage and steals half of that amount as healing for the CFO.
2. **Tax Audit**: Reduces one player’s attack by 3 for the next 2 turns. The player rolls 1d6; on a 5 or 6, they resist the debuff.
3. **Budget Cut**: At 50% health, the CFO reduces all players' health by 1d4 as a corporate-wide "cost-saving measure."
4. **Golden Parachute**: When the CFO's health drops below 10, they become immune to all debuffs for 2 turns.

## Boss Encounter Flow

### 1. **Preparation**:
- Before entering the boss room, players are warned of an incoming boss encounter (e.g., "Prepare for the CEO's wrath").
- Players can heal, adjust strategies, and ensure cooldowns are ready.

### 2. **Combat Phases**:
- The fight progresses through multiple phases depending on the boss’s remaining health (e.g., The CEO at 50% health summons minions).
- Each phase introduces new challenges or boosts the boss’s stats and abilities.

### 3. **Victory**:
- Upon defeating the boss, players earn **extra XP** and potentially rare rewards (e.g., a corporate item like "Company Car" that reduces cooldowns by 1 turn for the rest of the game).
- Players' health is fully restored, cooldowns are reset, and they move on to the next room.

## Sample Boss Fight

### CEO Encounter Example:
1. **Player's Turn**:
   - The player (Software Engineer) chooses "Attack with Keyboard," rolls 1d6 for damage, and adds their +3 modifier. Total damage = 5.
   
2. **CEO's Turn**:
   - The CEO uses **Cut the Budget**, rolling 1d6. The roll is a 5, reducing the player's defense by 2 for 3 turns.
   
3. **Phase 2**:
   - When the CEO's health drops below 50%, they use **Rally the Troops** to summon two **Interns** with 10 health each and a +2 attack modifier.
   
4. **Player's Turn**:
   - The player drinks "Coffee," gaining +1 to attack for 2 turns and recovers 1d3 health.
   
5. **Victory**:
   - After defeating the CEO and the Interns, the player earns a large XP bonus and a rare item.
```
