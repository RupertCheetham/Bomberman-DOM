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

// Function to start the game timer on page load
const startGameTimer = (duration) => {
  const timerDisplay = document.querySelector('.game-timer');
  let timeRemaining = duration;

  const countdownInterval = setInterval(() => {
      // Update the timer display
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;

      // Format minutes and seconds (e.g., 1:05)
      timerDisplay.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (timeRemaining <= 0) {
          clearInterval(countdownInterval);
          timerDisplay.innerHTML = "Time's up! Game Over!";
          
          // Trigger any game-ending logic here
          endGame();
      }

      timeRemaining -= 1;
  }, 1000);
};

// Function to handle game end
const endGame = () => {
  console.log("Game over!");
  // Add any additional logic like disabling movement, displaying results, etc.
};

// Start the game timer for 5 minutes (300 seconds) when the page loads
window.onload = () => {
  const gameDuration = 300; // 5 minutes in seconds
  startGameTimer(gameDuration);
};


export const players = [player1, player2, player3, player4]; // Define an array of players

export const createLivesDisplay = (player) => {
  const livesElement = createElement("div", {
      attrs: {
          class: `${player.id}-lives`,  // Unique class for each player's lives display
          style: 'margin: 10px;'  // You can customize the style as needed
      },
      children: [`Player ${player.id} Lives: ${player.lives}`]  // Display initial lives
  });

  // const livesDOMElement = render(livesElement);
  // document.querySelector('.lives-display').appendChild(livesDOMElement);
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

// export const updateLivesDisplay = (player) => {
//   const livesElement = document.querySelector(`.${player.id}-lives`);
//   if (livesElement) {
//       livesElement.innerHTML = `Player ${player.id} Lives: ${player.lives}`;
//   }
// };

// Example of reducing lives and updating display
// export const loseLife = (player) => {
//   if (player.lives > 0) {
//       player.lives -= 1;
//       updateLivesDisplay(player);
//   } else {
//       console.log(`${player.id} is out of lives!`);
//   }
// };

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

//Move player with collision detection
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
  // Prevent default scrolling behavior for specific keys
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
    event.preventDefault();
  }

  // Check if the player is present in the players array and on the map
  const isPlayer1Active = players.some(p => p.id === 'player1');
  const isPlayer2Active = players.some(p => p.id === 'player2');
  const isPlayer3Active = players.some(p => p.id === 'player3');
  const isPlayer4Active = players.some(p => p.id === 'player4');

  switch (event.key) {
    // Player 1 Controls
    case 'ArrowUp':
      if (isPlayer1Active) movePlayer(player1, 'up', players);
      break;
    case 'ArrowDown':
      if (isPlayer1Active) movePlayer(player1, 'down', players);
      break;
    case 'ArrowLeft':
      if (isPlayer1Active) movePlayer(player1, 'left', players);
      break;
    case 'ArrowRight':
      if (isPlayer1Active) movePlayer(player1, 'right', players);
      break;
    case ' ':
      if (isPlayer1Active) spawnBomb(player1);
      break;

    // Player 2 Controls (WASD + F for bomb)
    case 'w':
      if (isPlayer2Active) movePlayer(player2, 'up', players);
      break;
    case 's':
      if (isPlayer2Active) movePlayer(player2, 'down', players);
      break;
    case 'a':
      if (isPlayer2Active) movePlayer(player2, 'left', players);
      break;
    case 'd':
      if (isPlayer2Active) movePlayer(player2, 'right', players);
      break;
    case 'f':
      if (isPlayer2Active) spawnBomb(player2);
      break;

    // Player 3 Controls (IJKL + ; for bomb)
    case 'i':
      if (isPlayer3Active) movePlayer(player3, 'up', players);
      break;
    case 'k':
      if (isPlayer3Active) movePlayer(player3, 'down', players);
      break;
    case 'j':
      if (isPlayer3Active) movePlayer(player3, 'left', players);
      break;
    case 'l':
      if (isPlayer3Active) movePlayer(player3, 'right', players);
      break;
    case ';':
      if (isPlayer3Active) spawnBomb(player3);
      break;

    // Player 4 Controls (5RTY + U for bomb)
    case '5':
      if (isPlayer4Active) movePlayer(player4, 'up', players);
      break;
    case 't':
      if (isPlayer4Active) movePlayer(player4, 'down', players);
      break;
    case 'r':
      if (isPlayer4Active) movePlayer(player4, 'left', players);
      break;
    case 'y':
      if (isPlayer4Active) movePlayer(player4, 'right', players);
      break;
    case 'u':
      if (isPlayer4Active) spawnBomb(player4);
      break;

    default:
      console.log(`Key "${event.key}" pressed, but no action is assigned.`);
      break;
  }
};


const barPlayer1 = {x:0, y: 0, id: 'player1', lives: 3};
const barPlayer2 = {x:0, y: 1, id: 'player2', lives: 3}; 
const barPlayer3 = {x:9, y: 0, id: 'player3', lives: 3};
const barPlayer4 = {x:9, y: 2, id: 'player4', lives: 3};

export const barPlayers = [barPlayer1, barPlayer2, barPlayer3, barPlayer4];

export const spawnBarPlayers = (playerNum) => {
  for (let i = 0; i < playerNum; i++) {
      const player = barPlayers[i];
      const vPlayerElement = createElement("div", {
          attrs: {
              class: `${player.id}`, // Give the player a unique class
              style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1};` // Set the grid position
          },      
      });
      
      // Create the lives text element, positioned one space to the right (x + 2)
      const vLivesText = createElement("div", {
        attrs: {
            class: `${player.id}-lives`, // Unique class for the lives text
            style: `grid-column-start: ${player.x + 2}; grid-row-start: ${player.y + 1}; position: absolute;` // Position the text one column to the right
        },
        children: [`Player ${player.id[6]} - Lives: ${player.lives}`]  // Display initial lives
    });

    // Render and append both player and lives elements to the game map
    const playerElement = render(vPlayerElement);
    const livesTextElement = render(vLivesText);

    document.querySelector('.gameMap').appendChild(playerElement);
    document.querySelector('.gameMap').appendChild(livesTextElement);
}
};

// function to remove player lives if hit by explosion, if all lives lost then removal from map
// also updates the scoreboard and players array
export function removeLife(player, gameMap, x ,y) {
  // Find the player in the players array
  const playerIndex = players.findIndex(p => p.id === player.id);

  if (playerIndex !== -1) {
      // Decrease the player's lives
      players[playerIndex].lives--;

      x = players[playerIndex].x;   
      y = players[playerIndex].y;

                  //add playerHit(x, y) and it's styling and setTimeout(() => , 200);
                  const hitElement = playerHit(players[playerIndex].x + 1, players[playerIndex].y + 1);
                  gameMap.appendChild(hitElement);
                  setTimeout(() => {
                      hitElement.remove(); // Remove the hit effect after 200ms
                  }, 200);
      }

      // Update the player's lives display on the scoreboard
      const playerLivesElement = document.querySelector(`.${player.id}-lives`);
      if (playerLivesElement) {
           // Update the lives text inside the element, keeping the format
           playerLivesElement.textContent = `Player ${player.id[6]} - Lives: ${players[playerIndex].lives}`;
      }

      // Check if the player's lives are zero
      if (players[playerIndex].lives <= 0) {
          // Remove the player from the game map if lives are zero
          const playerElement = document.querySelector(`.${player.id}`);
          if (playerElement) { 
            //add playerHit(x, y) and it's styling and setTimeout(() => , 200);

              playerElement.remove();
          }
          //Remove the player from the players array
          players.splice(playerIndex, 1); // If you want to completely remove the player
      }

      console.log("players array length", players.length);
  }



function playerHit(x, y) {
  const vPlayerHit = createElement("div", {
      attrs: {
          class: "hit",
          style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
      }
  });
  const playerHit = render(vPlayerHit);
  return playerHit;
}




