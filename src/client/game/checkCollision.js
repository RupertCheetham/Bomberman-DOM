import { parsedMap, walkableChars, isPositionWalkableBySoftBlocks } from "./map";

export function checkCollision(x, y) {

    // Ensure the coordinates are within the bounds of the map
    if (x < 0 || y < 0 || y > parsedMap.length || x > parsedMap[0].length) {
        console.log(`Out of bounds: (${x + 1}, ${y + 1})`);
        return true; // Out of bounds, collision exists
    }

  x =x-1
  y = y-1
    // Check if the tile is a hard block (non-walkable)
    if (!walkableChars.includes(parsedMap[y][x])) {
        console.log(`Not walkable tile at (${x + 1}, ${y + 1}): ${parsedMap[y][x]}`);
        return true; // Collision exists
    }

    // Check if the position is occupied by a soft block
    if (!isPositionWalkableBySoftBlocks(x, y)) {
        console.log(`Position occupied by a soft block at (${x + 1}, ${y + 1})`);
        return true; // Collision exists
    }

    // No collision detected
    return false;
}
