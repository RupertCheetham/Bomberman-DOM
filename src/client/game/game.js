// // # Main game logic

import { spawnBomb } from "./events";

// Import `isWalkable` from map.js
import { isWalkable } from './map.js';
import createElement from "../../vdom/createElement";
import render from '../../vdom/render';

// Define player objects with x and y coordinates
const player1 = { x: 1, y: 3, id: 'player1', lives: 3 };  // Add lives
const player2 = { x: 13, y: 13, id: 'player2', lives: 3 };
const player3 = { x: 1, y: 13, id: 'player3', lives: 3 };
const player4 = { x: 13, y: 3, id: 'player4', lives: 3 };

export const players = [player1, player2, player3, player4]; // Define an array of players

export const createLivesDisplay = (player) => {
  const livesElement = createElement("div", {
      attrs: {
          class: `${player.id}-lives`,  // Unique class for each player's lives display
          style: 'margin: 10px;'  // You can customize the style as needed
      },
      children: [`Player ${player.id} Lives: ${player.lives}`]  // Display initial lives
  });

  const livesDOMElement = render(livesElement);
  document.querySelector('.lives-display').appendChild(livesDOMElement);
};

// Function to create and spawn players
export const spawnPlayers = (playerNum) => {
  // Loop through the players array and add players to the game map based on playerNum
  for (let i = 0; i < playerNum; i++) {
      const player = players[i];
      const vPlayerElement = createElement("div", {
          attrs: {
              class: `${player.id}`, // Give the player a unique class
              style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1};` // Set the grid position
          }
      });
      
      const playerElement = render(vPlayerElement)
      // Append the player element to the game map
      document.querySelector('.gameMap').appendChild(playerElement);

       // Create lives display for each player
       createLivesDisplay(player);
  }
};

export const updateLivesDisplay = (player) => {
  const livesElement = document.querySelector(`.${player.id}-lives`);
  if (livesElement) {
      livesElement.innerHTML = `Player ${player.id} Lives: ${player.lives}`;
  }
};

// Example of reducing lives and updating display
export const loseLife = (player) => {
  if (player.lives > 0) {
      player.lives -= 1;
      updateLivesDisplay(player);
  } else {
      console.log(`${player.id} is out of lives!`);
  }
};

export const updatePlayerPosition = (player) => {
  const playerElement = document.querySelector(`.${player.id}`);

  // Log the grid position before moving to a new place
  if (playerElement) {
      console.log(`Before move: Player ${player.id} at grid position X = ${player.x}, Y = ${player.y}`);
      
      // Apply the grid position to the CSS grid properties
      playerElement.style.gridColumnStart = player.x + 1;  // Add 1 since grid starts at 1
      playerElement.style.gridRowStart = player.y + 1;     // Add 1 since grid starts at 1

      // Log the player and its updated grid position for debugging
      console.log(`After move: Player ${player.id} moved to grid position X = ${player.x}, Y = ${player.y}`);
  } else {
      console.warn(`Player element with id ${player.id} not found`);
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

// Function to handle key presses
export const handleKeyPress = (event) => {
  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
      case ' ':
        event.preventDefault(); // Prevent the browser's default scrolling behavior
        break;
  }

    switch (event.key) {
      case 'ArrowUp':
        movePlayer(player1, 'up', players);
        break;
      case 'ArrowDown':
        movePlayer(player1, 'down', players);
        break;
      case 'ArrowLeft':
        movePlayer(player1, 'left', players);
        break;
      case 'ArrowRight':
        movePlayer(player1, 'right', players);
        break;
      case ' ':
        spawnBomb(player1);
        break;

      // Player 2 Controls (WASD + F for bomb)
      case 'w':
        movePlayer(player2, 'up', players);
        break;
      case 's':
        movePlayer(player2, 'down', players);
        break;
      case 'a':
        movePlayer(player2, 'left', players);
        break;
      case 'd':
        movePlayer(player2, 'right', players);
        break;
      case 'f':
        spawnBomb(player2);
        break;

      // Player 3 Controls (IJKL + ; for bomb)
      case 'i':
        movePlayer(player3, 'up', players);
        break;
      case 'k':
        movePlayer(player3, 'down', players);
        break;
      case 'j':
        movePlayer(player3, 'left', players);
        break;
      case 'l':
        movePlayer(player3, 'right', players);
        break;
      case ';':
        spawnBomb(player3);
        break;

      // Player 4 Controls (5RTY + U for bomb)
      case '5':
        movePlayer(player4, 'up', players);
        break;
      case 't':
        movePlayer(player4, 'down', players);
        break;
      case 'r':
        movePlayer(player4, 'left', players);
        break;
      case 'y':
        movePlayer(player4, 'right', players);
        break;
      case 'u':
        spawnBomb(player4);
        break;

      default:
        console.log(`Key "${event.key}" pressed, but no action is assigned.`);
        break;
    }
};