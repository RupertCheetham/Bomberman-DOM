import { parsedMap, walkableChars, isPositionWalkableBySoftBlocks } from "./map";

export function checkCollision(x, y) {

    // Ensure the coordinates are within the bounds of the map
    if (x < 0 || y < 0 || y > parsedMap.length || x > parsedMap[0].length) {
        return true; // Out of bounds, collision exists
    }

    x = x - 1
    y = y - 1
    // Check if the tile is a hard block (non-walkable)
    if (!walkableChars.includes(parsedMap[y][x])) {
        return true; // Collision exists
    }

    // Check if the position is occupied by a soft block
    if (!isPositionWalkableBySoftBlocks(x, y)) {
        return true; // Collision exists
    }

    // No collision detected
    return false;
}



export const handlePowerUpCollection = (player, gameMap) => {

    // Find any power-up at the player's current position
    const powerUpElement = gameMap.querySelector(
        `.power-up[style*="grid-column-start: ${player.x + 1}"][style*="grid-row-start: ${player.y + 1}"]`
    );

    if (powerUpElement) {
        // Determine which type of power-up the player has collected
        if (powerUpElement.classList.contains('hasPowerUpBomb')) {
            player.hasPowerUpBomb = true;  // Grant the bomb power-up
            powerUpElement.remove();
            return "hasPowerUpBomb"
        } else if (powerUpElement.classList.contains('hasPowerUpFlames')) {
            player.hasPowerUpFlames = true;  // Grant the flames power-up
            powerUpElement.remove();
            return "hasPowerUpFlames"
        } else if (powerUpElement.classList.contains('hasPowerUpSpeed')) {
            player.hasPowerUpSpeed = true;  // Grant the speed power-up
            // Remove the power-up from the map after collection
            powerUpElement.remove();
            return "hasPowerUpSpeed"
        }
    }

    return "noPowerUp"
};
