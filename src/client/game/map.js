import createElement from "../../vdom/createElement";

const map = `
+++++++++++++++
+++++++++++++++
HHHHHHHHHHHHHHH
H1...........4H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H3...........2H
HHHHHHHHHHHHHHH
`;

const levelChars = {
    "+": "banner",
    "H": "hard-block",
    "S": "soft-block",
    ".": "ground",
    "1": "player1",
    "2": "player2",
    "3": "player3",
    "4": "player4",
}

const walkableChars = ['.'];  // Only the ground is walkable


// Parse the map into a 2D array
const parsedMap = map.trim().split("\n").map((line) => [...line]);

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

     // Check if players is an array before iterating
    //  if (Array.isArray(players)) {
        // Check if the tile is occupied by another player
        for (const player of players) {
            if (player.x === x && player.y === y) {
                console.log(`Tile occupied by another player at (${x}, ${y})`); // Log collision
                return false; // Tile occupied by another player
            }
    //     }
    // } else {
    //     console.warn('players is not an array or is undefined');
    // }

    console.log(`Tile is walkable at (${x}, ${y})`); // Log successful check
    return true; // Tile is walkable
};
    }
