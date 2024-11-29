import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { bombLocations } from "./events";
import { spawnPlayers } from "./game";

const map = `
+++++++++++++++
+++++++++++++++
HHHHHHHHHHHHHHH
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
HHHHHHHHHHHHHHH
`;

const levelChars = {
    "+": "banner",
    "H": "hard-block",
    ".": "ground",
}

export const walkableChars = ['.'];  // Only the ground is walkable

// Parse the map into a 2D array
export const parsedMap = map.trim().split("\n").map((line) => [...line]);

// Function to create the gameMap element
export const gameMap = (playerNum) => {

    // Generate the map elements based on the symbols
    const mapElements = parsedMap.flatMap((row) =>
        row.map((cell) => {
            let className = levelChars[cell];
            if (playerNum < 4 && className === "player4") className = "ground";
            if (playerNum < 3 && className === "player3") className = "ground";
            // Create the individual cell
            return createElement("div", {
                attrs: {
                    class: `cell ${className}`
                }
            });
        })
    );

    let vPlayers = spawnPlayers(playerNum)
    const combinedElements = mapElements.concat(vPlayers);

    // Create the full map container with direct child cells
    return createElement("div", {
        attrs: {
            class: "gameMap",
        },
        children: combinedElements
    });
};

//Collision detection function
// export const isWalkable = (x, y, players = []) => {
export const isWalkable = (x, y, players) => {

    // Ensure the coordinates are within the bounds of the map
    if (x < 0 || y < 0 || y >= parsedMap.length || x >= parsedMap[0].length) {
        console.log(`Out of bounds: (${x}, ${y})`);
        return false; // Out of bounds, not walkable
    }

    // Check if the tile is walkable (only ground is walkable now)
    if (!walkableChars.includes(parsedMap[y][x])) {
        console.log(`Not walkable tile at (${x}, ${y}): ${parsedMap[y][x]}`); // Log tile type
        return false;
    }

    // Check if the position is occupied by a soft block
    if (!isPositionWalkableBySoftBlocks(x, y)) {
        console.log(`Position occupied by a soft block at (${x}, ${y})`);
        return false; // Position is blocked by a soft block
    }

    // Check if the position is occupied by a player
    if (players.some(player => player.x === x && player.y === y)) {
        console.log(`Position occupied by player at (${x}, ${y})`);
        return false; // Position is occupied by a player
    }

    // Check if the position is occupied by a bomb
    if (bombLocations.some(bomb => bomb.x === x && bomb.y === y)) {
        return false; // Position is occupied by a bomb
    }

    console.log(`Tile is walkable at (${x}, ${y})`); // Log successful check
    return true; // Tile is walkable
};

//set locations for spawning a soft block
const softBlock1 = { x: 3, y: 5, id: 'softBlock1', walkable: false };  // Starting position for softBlock1
const softBlock2 = { x: 3, y: 11, id: 'softBlock2', walkable: false };  // Starting position for softBlock2
const softBlock3 = { x: 5, y: 3, id: 'softBlock3', walkable: false };  // Starting position for softBlock3
const softBlock4 = { x: 5, y: 13, id: 'softBlock4', walkable: false };  // Starting position for softBlock4
const softBlock5 = { x: 7, y: 7, id: 'softBlock5', walkable: false };  // Starting position for softBlock5
const softBlock6 = { x: 7, y: 9, id: 'softBlock6', walkable: false };  // Starting position for softBlock6
const softBlock7 = { x: 9, y: 3, id: 'softBlock7', walkable: false };  // Starting position for softBlock7
const softBlock8 = { x: 9, y: 13, id: 'softBlock8', walkable: false };  // Starting position for softBlock8
const softBlock9 = { x: 11, y: 5, id: 'softBlock9', walkable: false };  // Starting position for softBlock9
const softBlock10 = { x: 11, y: 11, id: 'softBlock10', walkable: false };  // Starting position for softBlock10

export const softBlocks = [
    softBlock1, softBlock2, softBlock3, softBlock4,
    softBlock5, softBlock6, softBlock7, softBlock8,
    softBlock9, softBlock10
];

export const spawnSoftBlocks = () => {
    // Assign power-ups to 3 random soft blocks
    const blocksWithPowerUps = assignPowerUpsToSoftBlocks();

    // Loop through the softBlocks array and add softBlocks to the game map 
    for (const block of softBlocks) {
        const vBlockElement = createElement("div", {
            attrs: {
                class: `soft-block ${block.id}`, // Use 'soft-block' class for styling
                style: `grid-column-start: ${block.x + 1}; grid-row-start: ${block.y + 1};` // Set the grid position
            }
        });

        const blockElement = render(vBlockElement);
        document.querySelector('.gameMap').appendChild(blockElement);

        // Listen for soft block destruction and reveal power-up
        blockElement.addEventListener('destroyed', () => {
            // Check if this block had a power-up
            if (blocksWithPowerUps.includes(block)) {
                const powerUpElement = createPowerUpElement(block.powerUp, block.x, block.y);
                document.querySelector('.gameMap').appendChild(powerUpElement);
            }
        });
    }
};

export const isPositionWalkableBySoftBlocks = (x, y) => {
    return !softBlocks.some(block => block.x === x && block.y === y && !block.walkable);
};

// Array to store power-up types
const powerUps = ['hasPowerUpBomb', 'hasPowerUpFlames', 'hasPowerUpSpeed'];

// Function to assign power-ups to 3 soft blocks
export const assignPowerUpsToSoftBlocks = () => {
    // Directly assign power-ups to specific soft blocks by index or ID
    const powerUpAssignments = [
        { blockIndex: 3, powerUp: 'hasPowerUpBomb' },
        { blockIndex: 6, powerUp: 'hasPowerUpFlames' },
        { blockIndex: 9, powerUp: 'hasPowerUpSpeed' }
    ];

    // Apply the power-up to each specified soft block
    powerUpAssignments.forEach(({ blockIndex, powerUp }) => {
        const block = softBlocks[blockIndex];
        if (block) {
            block.powerUp = powerUp;
        }
    });

    console.log("Power-ups assigned to soft blocks:", powerUpAssignments);
    return powerUpAssignments; // Return the list of blocks with assigned power-ups
};



// Function to create a power-up element based on the type
export const createPowerUpElement = (powerUpType, x, y) => {
    const powerUpElement = createElement("div", {
        attrs: {
            class: `power-up ${powerUpType}`, // Use a specific class for each power-up
            style: `grid-column-start: ${x + 1}; grid-row-start: ${y + 1};` // Set the grid position
        }
    });

    return render(powerUpElement); // Render and return the power-up element
};

// export const spawnPowerUps = () => {
//     // Randomly pick 3 different soft blocks to hide the power-ups
//     const chosenSoftBlocks = pickRandomSoftBlocks(3);

//     // Loop through the selected blocks to place the power-ups
//     chosenSoftBlocks.forEach((softBlock, index) => {
//         const powerUpElement = document.createElement("div");
//         powerUpElement.classList.add("power-up");

//         // Assign the correct power-up type and styling
//         if (index === 0) {
//             powerUpElement.classList.add("hasPowerUpBomb"); // Bomb power-up styling
//         } else if (index === 1) {
//             powerUpElement.classList.add("hasPowerUpFlames"); // Flames power-up styling
//         } else if (index === 2) {
//             powerUpElement.classList.add("hasPowerUpSpeed"); // Speed power-up styling
//         }

//         // Position the power-up in the same location as the soft block
//         powerUpElement.style.gridColumnStart = softBlock.x + 1;
//         powerUpElement.style.gridRowStart = softBlock.y + 1;

//         // Append the power-up to the game map
//         document.querySelector('.gameMap').appendChild(powerUpElement);
//     });
// };
