// Cursed To Be Chained
// A short text-based choose-your-own-adventure RPG demonic noir game
// Navigate the city, fight demons and rescue the Chained Prince of the Shadows in the hopes that he will free you from the curse that binds your soul to this city

// Include readline for player input
const readline = require('readline-sync');

// Game state variables
let gameRunning = true;
let playerHealth = 100;
let playerCoin = 20; // Starting coins
let currentLocation = "Miragem City";
let firstVisit = true;
let inventory = []; // Will store all player items

// Item templates with properties
const lifePotion = {
    name: "Life Potion",
    type: "Potion",
    value: 5, // Cost in coins
    effect: 30, // Healing amount
    description: "Restores 30 health points"
};

const sword = {
    name: "Sword",
    type: "Weapon",
    value: 10, // Cost in coins
    effect: 10, // Damage amount
    description: "A magical blade for combat"
};

const cross = {
    name: "Cross",
    type: "Defense",
    value: 15, // Cost in coins
    effect: 15 // Protection amount
};

const ashSword = {
    name: "The Sword of Ashes",
    type: "Weapon",
    value: 20, // Cost in moral- I mean coins
    effect: 20, // Damage amount
    description: "The Sword of Ashes carries both the strength of all those who died wielding it, and their sorrow"
};

const soulCrown = {
    name: "The Soul Crown",
    type: "Reward",
    description: "The Soul Crown is your objective, but it could be your rescue, or a curse..."
}

// --- LOCATION SYSTEM ---

/**
* Returns a description for the specified location
* Uses a switch statement for clear, maintainable location descriptions
* @param {string} location - The location to describe
* @returns {string} A description of the location
*/
function getLocationDescription(location) {
    switch(location) {
        case "Miragem City":
            const baseDescription = "You're in Miragem City. There are tall buildings of various assortments all around you, connected by catwalks. Below, you can see the deep end of the city: the lower districts. A suffocating haze hangs around the city permanently.";

            if(firstVisit) {
                firstVisit = false;
                return (baseDescription + "\n\nA tall woman with black hair and pale skin walks over to you. Her fox eyes, lined with purple eyeshadow, analyze you carefully. 'Welcome, Rei. Legend has it the Chained Prince of the Shadows is imprisoned in the tallest tower hidden at the back of the city... Do what you must and come back alive.' She then turns around and walks off.");
            } else {
                console.log(baseDescription);
            }
            break;
        case "Blacksmith":
            return "It's relatively dark here, but you can feel the heat all around you. Weapons and armour line the walls.";
        case "Upper Districts":
            return "The Upper Districts are lined with shops and buildings, all abandoned or closed down. However, you spot a dusty old potion shop in a corner...";
        case "Undergrounds":
            return "You walk down the stairs of the abandoned subway station, deeper and deeper underground. Seemingly senseless murals and writings litter the walls. Everything is quiet, but you might not be alone...";
        default:
            return "You are lost...";
    }
}

// Displays the current location's name and description
function showLocation() {
    console.log("\n--- " + currentLocation.toUpperCase() + " ---");
    console.log(getLocationDescription(currentLocation));
}

// --- STATUS DISPLAY SYSTEM ---

// Shows status including health, coins and location
function showStatus() {
    console.log("\n--- STATUS ---");
    console.log("?  Health: " + playerHealth);
    console.log("?  Coins: " + playerCoin);
    console.log("?  Location: " + currentLocation);
}

// --- COMBAT SYSTEM ---

/**
 * Handles battle encounters with demons or the final boss
 * @param {boolean} isBoss - Whether this is the boss battle with the Chained Prince of Shadows
 * @returns {boolean} Whether the battle was won
 */
function handleCombat(isBoss = false) {
    let inBattle = true;
    let demonHealth = 3;
    let bossDamage = 40;
    let demonDamage = 20;

    // Find the best weapon to get its properties
    const weapon = getBestItem("Weapon");

    // Find the cross to get its properties
    const cross = getBestItem("Defense");

    console.log("\nA demon lunges towards you and you dodge. Battle started.");
    
    if(!weapon) {
        if(isBoss) {
            updateHealth(-100);
            return false;
        } else {
            console.log("Narrator: 'Oh wait! Haha, you don't have a weapon!'");
            updateHealth(-100);
            return false;
        }
    }

    if(hasItemType("Weapon")) {
        console.log("\nNarrator: 'Wait?! Right... you have a " + weapon.name + ". Fine by me.'");
        console.log("");
    }

    if(hasItemType("Defense")) {
        console.log("Narrator: 'And you have a " + cross.name + "?! Hell.'");
        console.log("");
    }

    while(inBattle) {
        if(isBoss) {
            if(hasGoodEquipment && playerHealth >= 50) {
                // Add sequence of if/else statments with text and dialogue to decide the different outcomes depending on the player's choices
            }
        } else {
            if(hasItemType("Weapon") && hasItemType("Defense")) {
                console.log("\nDemon health: " + demonHealth);
                console.log("You deal damage.");
                demonHealth--;
                console.log("\nThe demon lunges at you. You take " + (demonDamage - cross.effect) + " damage.");
                updateHealth(-(demonDamage - cross.effect));
                console.log("\nThe cross reduced the damage you took. You received " + cross.effect + " protection.");
            } else if(hasItemType("Weapon")) {
                console.log("\nDemon health: " + demonHealth);
                console.log("You deal damage.");
                demonHealth--;
                console.log("\nThe demon lunges at you. You take " + demonDamage + " damage.");
                updateHealth(-demonDamage);
            }
        }

        if(demonHealth <= 0) {
            console.log("\nDemon defeated. You watch its mutilated body on the floor.");
            console.log("You get 10 coins for effort.");
            console.log("\nShocked, you run up the stairs and out of the Undergrounds.");
            playerCoin += 10;
            inBattle = false;
            currentLocation = "Miragem City";
            return true;
        }
    }
}

// --- LOCATION-SPECIFIC HANDLERS ---

/**
 * Handles player choices in Miragem City
 * @param {number} choiceNum - The selected choice number
 */
function handleCityChoice(choiceNum) {
    switch(choiceNum) {
        case 1: // Blacksmith
            currentLocation = "Blacksmith";
            console.log("\nYou enter the blacksmith's shop.");
            break;
        case 2: // Upper Districts
            currentLocation = "Upper Districts";
            console.log("\nYou head to the Upper Districts.");
            break;
        case 3: // Undergrounds
            currentLocation = "Undergrounds";
            console.log("\nYou decide to head straight for the tower - at the back of the city. To get there, you'll need to take a path through the Undergrounds, starting at an abandoned subway station...");
            console.log("\n--- THE UNDERGROUNDS ---");
            console.log("You walk down the stairs of the abandoned subway station, deeper and deeper underground. Seemingly senseless murals and writings litter the walls. Everything is quiet, but you might not be alone...");

            if(!handleCombat()) {
                currentLocation = "Miragem City";
            }
            break;
        case 4: // Check inventory
            displayInventory();
            break;
        case 5: // Check status
            showStatus();
            break;
        case 6: // Use item
            useItem();
            break;
        case 7: // Help
            showHelp();
            break;
        case 8: // Exit game
            console.log("\nAre you sure you want to leave? Farewell, but you'll come back soon...");
            gameRunning = false;
            break;
    }
}

/**
 * Handles player choices in the Blacksmith
 * @param {number} choiceNum - The selected choice number
 */
function handleBlacksmithChoice(choiceNum) {
    switch(choiceNum) {
        case 1: // Buy a sword
            buyFromBlacksmith();
            break;
        case 2: // Return to city
            currentLocation = "Miragem City";
            console.log("\nYou return to the city.");
            break;
        case 3: // Check inventory
            displayInventory();
            break;
        case 4: // Check status
            showStatus();
            break;
        case 5: // Use item
            useItem();
            break;
        case 6: // Help
            showHelp();
            break;
        case 7: // Exit game
            console.log("\nAre you sure you want to leave? Farewell, but you'll come back soon...");
            gameRunning = false;
            break;
    }
}

/**
 * Handles player choices in the Upper Districts
 * @param {number} choiceNum - The selected choice number
 */
function handleUpperDistrictsChoice(choiceNum) {
    switch(choiceNum) {
        case 1: // Buy a potion
            buyFromPotionShop();
            break;
        case 2: // Return to city
            currentLocation = "Miragem City";
            console.log("\nYou return to the city.");
            break;
        case 3: // Check inventory
            displayInventory();
            break;
        case 4: // Check status
            showStatus();
            break;
        case 5: // Use item
            useItem();
            break;
        case 6: // Help
            showHelp();
            break;
        case 7: // Exit game
            console.log("\nAre you sure you want to leave? Farewell, but you'll come back soon...");
            gameRunning = false;
            break;
    }
}

/**
 * Routes player choices to the appropriate location handler
 * Central command processing point for the game
 * @param {number} choiceNum - The selected choice number
 */
function processChoice(choiceNum) {
    switch(currentLocation) {
        case "Miragem City":
            handleCityChoice(choiceNum);
            break;
        case "Blacksmith":
            handleBlacksmithChoice(choiceNum);
            break;
        case "Upper Districts":
            handleUpperDistrictsChoice(choiceNum);
            break;
    }
}

// --- ITEM FUNCTIONS ---
// Functions that handle item usage, checks and inventory

/**
 * Checks if player has an item of specified type
 * @param {string} type The type of item to check for
 * @returns {boolean} True if player has the item type
 */

function hasItemType(type) {
    return inventory.some(item => item.type === type);
}

// Displays inventory
function displayInventory() {
    console.log("\n--- INVENTORY ---");
    if(inventory.length === 0) {
        console.log("Narrator: 'Inventory empty. You came rather unprepared, Rei. It's rather funny how you think you'll make it even halfway.'");
        console.log("\nYou: 'What's your problem...'");
        return;
    } else {
        inventory.forEach((item) => {
            if(item.name === "Cross") {
                console.log("- " + item.name + "- keep that away from me-! Hell.");
            } else {
                console.log("- " + item.name + " - " + item.description);
            }
        });
    }
}

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
    if(hasItemType("Potion")) {
        console.log("\nYou drink the " + lifePotion.name + ".");
        console.log("\nNarrator: 'Full disclosure, I may or may not have poisoned it.'");
        console.log("\nYou: 'WHAT?! WHY?!'");
        console.log("\nNarrator: 'Calm down. I said I ??? or ??? ??? have done something.'");
        updateHealth(lifePotion.effect);
        let potionIndex = inventory.indexOf("Life Potion");
        inventory.splice(potionIndex, 1);
        return true;
    }
    console.log("\nNarrator: 'You don't have any usable items. If you're bleeding out or something, you're gonna have to deal with it.'");
    return false;
}

/**
 * Returns an array of items that have matching types
 * @param {string} type - The type of things to look for in inventory
 * @returns {array} The filtered array of matching items
 */
function getItemsByType(type) {
    return inventory.filter(item => item.type === type);
}

/**
 * Returns an array of the best items (highest protection/damage) in inventory
 * @param {string} type - The type of things to choose between
 * @returns {array} The filtered array of best items
 */
function getBestItem(type) {
    const items = getItemsByType(type);
    if(!items || items.length === 0) {
        return null;
    }

    let bestItem = items[0];
    for(let i = 0; i < items.length; i++) {
        if(items[i].effect > bestItem.effect) {
            bestItem = items[i];
        }
    }

    return bestItem;
}

/**
 * Checks if the player has good equipment to battle the Chained Prince of Shadows
 * @returns {boolean} - True if the player has suitable equipment, false if not
 */
function hasGoodEquipment() {
    if(inventory.some("The Sword of Ashes") && inventory.some("Cross")) {
        return true;
    } else {
        return false;
    }
}

// --- SHOPPING FUNCTIONS ---

// Handles buying items at the Blacksmith
function buyFromBlacksmith() {
    if(hasItemType("Weapon")) {
        console.log("\nNarrator: 'Rei, you already have a sword. Now what do you need another one for?'");
    }
    else if(playerCoin >= sword.value) {
        console.log("\nBlacksmith: 'Take this sword. You're going to need it.'");
        playerCoin -= sword.value;

        // Add sword object to inventory
        inventory.push({...sword}); // Create a copy of the sword object

        console.log("\nYou take the " + sword.name + " and look at its jewel-encrusted hilt, feeling the magic humming in its blade. You buy it for " + sword.value + " coins.");
        console.log("Remaining coins: " + playerCoin);
    } else {
        console.log("\nBlacksmith: 'You don't have enough coins. This isn't for free, you know. Come back later.'");
    }
}

// Handles buying items at the "Potions and Contortions" shop
function buyFromPotionShop() {
    if(hasItemType("Potion")) {
        console.log("\nNora: 'Hang on... you can only take one potion at a time.'");
    }
    else if(playerCoin >= lifePotion.value) {
        console.log("\nYou enter the shop with the sign that reads, 'Potions and Contortions'. Inside, you find a young woman with freckles and light pink hair up in space buns. Her necklace says, 'Nora'.");
        console.log("\nNora: 'This potion will heal your physical wounds, can't say the same for your spiritual ones, though.'");
        playerCoin -= lifePotion.value;

        // Add Life Potion object to inventory
        inventory.push({...lifePotion}); // Create a copy of the Life Potion object

        console.log("\nYou buy a " + lifePotion.name + " for " + lifePotion.value + " coins. You look hesitantly at the purple liquid swirling inside.");
        console.log("Remaining coins: " + playerCoin);
    } else {
        console.log("\nNora: 'No coins, no potion, sorry.'");
    }
}

// --- HELP SYSTEM ---

let helpCount = 0;

// Shows all available game commands and how to use them
function showHelp() {

    if(helpCount === 10) {
        console.log("\nNarrator: 'That's it. I've had just about enough of you, you little-' *g͔̯l̊ì̢t̚ĉh͖es̐̈́*");
        console.log("Narrator: 'HELL-'");
        console.log("The Narrator starts glitching out and distorting, and everything around you starts to melt.");
        updateHealth(-100);
    } else {
        console.log("\nNarrator: 'Help? Holy Beelzebub, you really are useless...'");
        console.log("\n--- HELP ---");

        console.log("\nMovement Commands:");
        console.log("- In Miragem City, choose 1-3 to travel to different locations");
        console.log("- In other locations, choose the return option to go back to Miragem City");

        console.log("\nBattle Information:");
        console.log("\nNarrator: '... Why don't we go to the Undergrounds and find out?'");

        console.log("\nItem usage:");
        console.log("- Life Potions restore 30 health");
        console.log("- You can buy Life Potions at the shop in the Upper Districts for 5 coins");
        console.log("- You can buy a sword at the blacksmith for 10 coins");

        console.log("\nOther commands:");
        console.log("- Choose the status option to see your current location, health and coins");
        console.log("- Choose the help option to see this message again");
        console.log("- Choose the exit option to end the game");

        console.log("\nTips:");
        console.log("- Keep healing potions for dangerous areas");
        console.log("- Defeat demons to earn coins");
        console.log("- Don't get too comfortable around the narrator...");

        console.log("\nNarrator: 'And look, if you ever need help... don't ask me.'");
        console.log("You: '...'");

        helpCount++;
    }

    if(helpCount === 8) {
        console.log("\nNarrator: 'Stop calling the help function.'");
    }

    if(helpCount === 9) {
        console.log("\nNarrator: 'I said STOP-'");
    }
}

// --- INPUT VALIDATION AND GAME LIMITS ---

/**
 * Updates player health with boundaries to keep it between 0 and 100
 * @param {number} change Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(change) {
    playerHealth += change;

    if(playerHealth > 100) {
        playerHealth = 100;
        console.log("You're at full health... for now, at least.");
    }

    if(playerHealth < 0) {
        playerHealth = 0;
        console.log("You're gravely wounded.");
    }

    console.log("Health is now: " + playerHealth);
    return playerHealth;
}

// --- AVAILABLE ACTIONS SYSTEM ---

/**
 * Returns the available choices for the current location
 * @param {string} location - The current location
 * @returns {string[]} Array of choice descriptions
 */
function getLocationChoices(location) {
    switch(location) {
        case "Miragem City":
            return [
                "Go to blacksmith",
                "Head to the Upper Districts",
                "Go straight to the tower the Prince is imprisoned in",
                "Check inventory",
                "Check status",
                "Use item",
                "Help",
                "Exit game"
            ];
        case "Blacksmith":
            return [
                "Buy sword (" + sword.value + " coins)",
                "Return to city",
                "Check inventory",
                "Check status",
                "Use item",
                "Help",
                "Exit game"
            ];
        case "Upper Districts":
            return [
                "Buy potion (" + lifePotion.value + " coins)",
                "Return to city",
                "Check inventory",
                "Check status",
                "Use item",
                "Help",
                "Exit game"
            ];
    }
}

/**
 * @returns {string} - Returns numbered options for location choices
 */
function printChoice() {
        const choices = getLocationChoices(currentLocation);
        console.log("\nWhat would you like to do?");
        choices.forEach((c, i) => console.log((i + 1) + ". " + (c)));
        return choices.length; // Return how many options we have
}

// --- MAIN GAME LOOP ---
// Controls the flow of the game

// Display the game title
console.log("\nWelcome to Cursed To Be Chained");

// Starting message
console.log("Now entering uncharted territory...");

// Welcome the player
console.log("\nRei, was it? Nevermind, not important...");
console.log("\nWelcome, Rei.");
console.log("You start with " + playerCoin + " coins.");
console.log("\nYour quest: Rescue the Chained Prince of the Shadows from the tower he's been imprisoned in, and hope that in return he'll free you from the curse that binds your soul to this city.");

while(gameRunning) {
    // Show current location and choices
    showLocation();

    // Show options for current location
    const maxChoice = printChoice();
    
    // Get and validate player choice
    let validChoice = false;
    while(!validChoice) {
        try {
            let choice = readline.question("\nEnter choice (number): ");

            // Check for sneaky empty input
            if(choice.trim() === "") {
                throw "Please enter a number.";
            }

            // Convert to number and check for validity
            let choiceNum = parseInt(choice);
            if(isNaN(choiceNum)) {
                throw "That's not a number. Please enter a number.";
            }
            
            // Handle choices based on location
            if(currentLocation === "Miragem City") {
                if(choiceNum < 1 || choiceNum > 8) {
                    throw "Please enter a number between 1 and 8.";
                }

                validChoice = true; // Valid choice made
                processChoice(choiceNum);
            } else if (currentLocation === "Blacksmith") {
                if(choiceNum < 1 || choiceNum > 7) {
                    throw "Please enter a number between 1 and 7.";
                }

                validChoice = true;
                processChoice(choiceNum);
            } else if(currentLocation === "Upper Districts") {
                if(choiceNum < 1 || choiceNum > 7) {
                    throw "Please enter a number between 1 and 7.";
                }

                validChoice = true;
                processChoice(choiceNum);
            }
        } catch(error) {
            console.log("\nERROR: " + error);
            console.log("LOG: RETRY LAST ACTION");
        }
    }
    //Check if player died
    if(playerHealth <= 0) {
        console.log("\nYOU DIED. GAME OVER.");
        gameRunning = false;
    }
}
