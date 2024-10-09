import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

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

    // Create the full map container with direct child cells
    return createElement("div", {
        attrs: {
            class: "gameMap",
        },
        children: mapElements
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

    console.log(`Tile is walkable at (${x}, ${y})`); // Log successful check
    return true; // Tile is walkable
};
    
//set locations for spawning a soft block
const softBlock1 = { x: 3, y: 5, id: 'softBlock1', walkable: false  };  // Starting position for softBlock1
const softBlock2 = { x: 3, y: 11, id: 'softBlock2', walkable: false  };  // Starting position for softBlock2
const softBlock3 = { x: 5, y: 3, id: 'softBlock3', walkable: false  };  // Starting position for softBlock3
const softBlock4 = { x: 5, y: 13, id: 'softBlock4', walkable: false  };  // Starting position for softBlock4
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

// Function to spawn soft blocks on top of the map
export const spawnSoftBlocks = () => {
    // Loop through the softBlocks array and add softBlocks to the game map 
    for (const block of softBlocks) {
        const vBlockElement = createElement("div", {
            attrs: {
                class: `soft-block ${block.id}`, // Use 'soft-block' class for styling
                style: `grid-column-start: ${block.x + 1}; grid-row-start: ${block.y + 1};` // Set the grid position
            }
        });
        
        const blockElement = render(vBlockElement);
        // Append the soft block element to the game map
        document.querySelector('.gameMap').appendChild(blockElement);
    }
};

export const isPositionWalkableBySoftBlocks = (x, y) => {
    return !softBlocks.some(block => block.x === x && block.y === y && !block.walkable);
};