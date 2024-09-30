// // # Main game logic

// Import `isWalkable` from map.js
import { isWalkable } from './map.js';

// Define player objects with x and y coordinates
const player1 = { x: 1, y: 3, id: 'player1' };  // Starting position for player 1
const player2 = { x: 13, y: 13, id: 'player2' }; // Starting position for player 2
const player3 = { x: 1, y: 13, id: 'player3' };  // Starting position for player 3
const player4 = { x: 13, y: 3, id: 'player4' };  // Starting position for player 4

const players = [player1, player2, player3, player4]; // Define an array of players

// Function to update player's position on the map
const updatePlayerPosition = (player) => {
    const playerElement = document.querySelector(`.${player.id}`);
    if (playerElement) {
      playerElement.style.transform = `translate(${player.x * 40}px, ${player.y * 40}px)`; // Move based on x and y
        // playerElement.style.gridColumnStart = player.x + 1;
        // playerElement.style.gridRowStart = player.y + 1;
    }
};

// Move player with collision detection
const movePlayer = (player, direction, players) => {
    let newX = player.x;
    let newY = player.y;

    // Determine the new position based on the direction
    switch (direction) {
      case 'up':
        newY -= 1;
        break;
      case 'down':
        newY += 1;
        break;
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
    }

   // Check if the new position is walkable
   if (isWalkable(newX, newY, players)) {
    // Move the player if the new position is valid
    player.x = newX;
    player.y = newY;
    updatePlayerPosition(player); // Update DOM to reflect new position
}
};

// Bomb dropping logic for players
const dropBomb = (player) => {
    console.log(`Player at (${player.x}, ${player.y}) dropped a bomb!`);
    // Add your bomb placement logic here
};

// Function to handle key presses
export const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        movePlayer(player1, 'up');
        break;
      case 'ArrowDown':
        movePlayer(player1, 'down');
        break;
      case 'ArrowLeft':
        movePlayer(player1, 'left');
        break;
      case 'ArrowRight':
        movePlayer(player1, 'right');
        break;
      case ' ':
        dropBomb(player1);
        break;

      // Player 2 Controls (WASD + F for bomb)
      case 'w':
        movePlayer(player2, 'up');
        break;
      case 's':
        movePlayer(player2, 'down');
        break;
      case 'a':
        movePlayer(player2, 'left');
        break;
      case 'd':
        movePlayer(player2, 'right');
        break;
      case 'f':
        dropBomb(player2);
        break;

      // Player 3 Controls (IJKL + ; for bomb)
      case 'i':
        movePlayer(player3, 'up');
        break;
      case 'k':
        movePlayer(player3, 'down');
        break;
      case 'j':
        movePlayer(player3, 'left');
        break;
      case 'l':
        movePlayer(player3, 'right');
        break;
      case ';':
        dropBomb(player3);
        break;

      // Player 4 Controls (5RTY + U for bomb)
      case '5':
        movePlayer(player4, 'up');
        break;
      case 't':
        movePlayer(player4, 'down');
        break;
      case 'r':
        movePlayer(player4, 'left');
        break;
      case 'y':
        movePlayer(player4, 'right');
        break;
      case 'u':
        dropBomb(player4);
        break;

      default:
        console.log(`Key "${event.key}" pressed, but no action is assigned.`);
        break;
    }
};
