import { spawnBomb } from "./events";
import { isWalkable } from "./map.js";
import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

import { initializeNameInputRoom, setGameStateNeedsUpdating } from "../../index.js";
import { handlePowerUpCollection } from "./checkCollision.js";
import { refreshChatRoom } from "../components/chatPlayerTimerBarCountdown.js";
import { ws } from "../websocket/chat.js";

export let gameResults = "";

// Define player objects with x and y coordinates
const player1 = { x: 1, y: 3, id: "player1", nickname: "", lives: 3, hasPowerUpBomb: false, hasPowerUpFlames: false, hasPowerUpSpeed: false };
const player2 = { x: 13, y: 13, id: "player2", nickname: "", lives: 3, hasPowerUpBomb: false, hasPowerUpFlames: false, hasPowerUpSpeed: false };
const player3 = { x: 1, y: 13, id: "player3", nickname: "", lives: 3, hasPowerUpBomb: false, hasPowerUpFlames: false, hasPowerUpSpeed: false };
const player4 = { x: 13, y: 3, id: "player4", nickname: "", lives: 3, hasPowerUpBomb: false, hasPowerUpFlames: false, hasPowerUpSpeed: false };

export const allPlayers = [player1, player2, player3, player4];



// empty array that active (nicknamed) players gets added to
export let players = []


export const addPlayer = (playerId, nickname) => {
  console.log("playerId", playerId)

  let currentPlayer = allPlayers[playerId - 1]
  console.log("currentPlayer", currentPlayer)
  currentPlayer.nickname = nickname
  console.log("updated currentPlayer", currentPlayer)

  players.push(currentPlayer)

  console.log('players array', players)

  let currentBarPlayer = barPlayers[playerId - 1]
  currentBarPlayer.nickname = nickname
  barPlayers.push(currentBarPlayer)

  refreshChatRoom()
};

let countdownInterval; // Declare globally to track the interval

// Function to start the game timer on page load
export const startGameTimer = (duration) => {
  const timerDisplay = document.querySelector(".game-timer");
  let timeRemaining = duration;

  // Clear any existing interval to avoid multiple timers running
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    // Update the timer display
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    // Format minutes and seconds (e.g., 1:05)
    timerDisplay.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval); // Clear the interval when time is up
      timerDisplay.innerHTML = "Time's up! Game Over!";

      // Trigger any game-ending logic here
      endGame();
      //initializeWaitingRoom();
    }

    timeRemaining -= 1;
  }, 1000);
};

// Function to handle game end
const endGame = () => {

  // Filter out players who still have lives
  const activePlayers = players.filter((player) => player.lives > 0);
  console.log("Active players:", activePlayers);
  const eliminatedPlayers = players.filter((player) => player.lives === 0);

  // If no active players, all have been eliminated
  if (activePlayers.length === 0) {
    console.log("Game over! All players have been eliminated. It's a draw!");
    gameResults += "Game over! All players have been eliminated. It's a draw!";
  } else if (activePlayers.length === 1) {
    // If there's only one active player, they win
    console.log(`Game over! Player ${activePlayers[0].nickname} wins!`);
    gameResults += "Game over! Player " + activePlayers[0].nickname + " wins!";
  } else {
    // Check if all active players have the same number of lives
    const sameLives = activePlayers.every(
      (player) => player.lives === activePlayers[0].lives
    );

    if (sameLives) {
      // All active players draw
      const playerNicknames = activePlayers
        .map((player) => `Player ${player.nickname}`)
        .join(", ");
      console.log(`Game over! All players draw!`);
      gameResults += "Game over! All players draw!";
    } else {
      // Find the player(s) with the highest number of lives
      const highestLives = Math.max(
        ...activePlayers.map((player) => player.lives)
      );
      const winners = activePlayers.filter(
        (player) => player.lives === highestLives
      );

      if (winners.length === 1) {
        console.log(`Game over! Player ${winners[0].nickname} wins!`);
        gameResults += "Game over! Player " + winners[0].nickname + " wins!";
      } else {
        // Specific players who draw with the highest lives
        const winnerNicknames = winners
          .map((player) => `Player ${player.nickname}`)
          .join(" and ");
        console.log(`Game over! ${winnerNicknames} draw!`);
        gameResults += "Game over! " + winnerNicknames + " draw!";
      }
    }

    // Announce players who have been eliminated
    if (eliminatedPlayers.length > 0) {
      const eliminatedNicknames = eliminatedPlayers
        .map((player) => `Player ${player.nickname}`)
        .join(", ");
      console.log(`Eliminated: ${eliminatedNicknames}`);
    }
  }

  announceResults(gameResults);
};



// Function to create and spawn players
export const spawnPlayers = (playerNum) => {
  let vPlayers = []
  // Loop through the players array and add players to the game map based on playerNum
  for (let i = 0; i < playerNum; i++) {
    const player = players[i];
    const vPlayerElement = createElement("div", {
      attrs: {
        class: `${player.id}`, // Give the player a unique class
        id: `${player.id}`,
        style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1
          };`, // Set the grid position
      },
    });
    vPlayers.push(vPlayerElement)
    //const playerElement = render(vPlayerElement);
    // Append the player element to the game map
    //document.querySelector(".gameMap").appendChild(playerElement);

  }
  return vPlayers
};

export const updatePlayerPosition = (player) => {
  const playerElement = document.getElementById(`${player.id}`);

  // Log the grid position before moving to a new place
  if (playerElement) {

    // Apply the grid position to the CSS grid properties
    playerElement.style.gridColumnStart = player.x + 1; // Add 1 since grid starts at 1
    playerElement.style.gridRowStart = player.y + 1; // Add 1 since grid starts at 1





  } else {
    console.warn(`Player element with id ${player.id} not found`);
  }
};

// Default movement cooldowns (in milliseconds)
const baseMovementCooldown = 200; // 200ms without power-up
const speedPowerUpCooldown = 100; // 100ms with power-up

// This object tracks the last move time for each player
const lastMoveTimes = {};

//Move player with collision detection
const movePlayer = (player, direction, players) => {

  const gameMap = document.querySelector('.gameMap');
  const currentTime = Date.now();

  // Determine cooldown based on whether the player has the speed power-up
  const cooldown = player.hasPowerUpSpeed ? speedPowerUpCooldown : baseMovementCooldown;

  // Check if the player is allowed to move (based on cooldown)
  if (!lastMoveTimes[player.id] || currentTime - lastMoveTimes[player.id] >= cooldown) {
    let newX = player.x;
    let newY = player.y;

    // Determine the new position based on the direction
    switch (direction) {
      case "up":
        newY -= 1;
        break;
      case "down":
        newY += 1;
        break;
      case "left":
        newX -= 1;
        break;
      case "right":
        newX += 1;
        break;
    }

    // Check if the new position is walkable
    if (isWalkable(newX, newY, players)) {
      // Move the player if the new position is valid
      player.x = newX;
      player.y = newY;
      //updatePlayerPosition(player); // Update DOM to reflect new position

      // Update the last move time for this player
      lastMoveTimes[player.id] = currentTime;
      const playerPowerUp = handlePowerUpCollection(player, gameMap);

      if (playerPowerUp !== "noPowerUp") {

      }

      const playermovementJSON = JSON.stringify({
        playerId: player.id,
        x: player.x,
        y: player.y,
      })

      let codedplayerMovementData = {
        Code: 3,
        wsm: playermovementJSON
      }

      // console.log("Sending message:", messageData);
      ws.send(JSON.stringify(codedplayerMovementData));

      setGameStateNeedsUpdating(true)
    }
  }



};


// Function to handle key presses
export const handleKeyPress = (event) => {
  // Prevent default scrolling behavior for specific keys
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)
  ) {
    event.preventDefault();
  }

  // Check if the player is present in the players array and on the map
  const isPlayer1Active = players.some((p) => p.id === "player1");
  const isPlayer2Active = players.some((p) => p.id === "player2");
  const isPlayer3Active = players.some((p) => p.id === "player3");
  const isPlayer4Active = players.some((p) => p.id === "player4");

  switch (event.key) {
    // Player 1 Controls
    case "ArrowUp":
      if (isPlayer1Active) movePlayer(player1, "up", players);
      break;
    case "ArrowDown":
      if (isPlayer1Active) movePlayer(player1, "down", players);
      break;
    case "ArrowLeft":
      if (isPlayer1Active) movePlayer(player1, "left", players);
      break;
    case "ArrowRight":
      if (isPlayer1Active) movePlayer(player1, "right", players);
      break;
    case " ":
      if (isPlayer1Active) spawnBomb(player1);
      let playerId = player1.id
      let playerJSON = JSON.stringify({ playerId })

      let codedPlayerData = {
        Code: 4,
        wsm: playerJSON
      }

      // console.log("Sending message:", messageData);
      ws.send(JSON.stringify(codedPlayerData));
      break;

    // Player 2 Controls (WASD + F for bomb)
    case "w":
      if (isPlayer2Active) movePlayer(player2, "up", players);
      break;
    case "s":
      if (isPlayer2Active) movePlayer(player2, "down", players);
      break;
    case "a":
      if (isPlayer2Active) movePlayer(player2, "left", players);
      break;
    case "d":
      if (isPlayer2Active) movePlayer(player2, "right", players);
      break;
    case "f":
      if (isPlayer2Active) spawnBomb(player2);
      playerId = player2.id
      playerJSON = JSON.stringify({ playerId })

      codedPlayerData = {
        Code: 4,
        wsm: playerJSON
      }

      // console.log("Sending message:", messageData);
      ws.send(JSON.stringify(codedPlayerData));
      break;

    // Player 3 Controls (IJKL + ; for bomb)
    case "i":
      if (isPlayer3Active) movePlayer(player3, "up", players);
      break;
    case "k":
      if (isPlayer3Active) movePlayer(player3, "down", players);
      break;
    case "j":
      if (isPlayer3Active) movePlayer(player3, "left", players);
      break;
    case "l":
      if (isPlayer3Active) movePlayer(player3, "right", players);
      break;
    case ";":
      if (isPlayer3Active) spawnBomb(player3);
      playerId = player3.id
      playerJSON = JSON.stringify({ playerId })

      codedPlayerData = {
        Code: 4,
        wsm: playerJSON
      }

      // console.log("Sending message:", messageData);
      ws.send(JSON.stringify(codedPlayerData));
      break;

    // Player 4 Controls (5RTY + U for bomb)
    case "5":
      if (isPlayer4Active) movePlayer(player4, "up", players);
      break;
    case "t":
      if (isPlayer4Active) movePlayer(player4, "down", players);
      break;
    case "r":
      if (isPlayer4Active) movePlayer(player4, "left", players);
      break;
    case "y":
      if (isPlayer4Active) movePlayer(player4, "right", players);
      break;
    case "u":
      if (isPlayer4Active) spawnBomb(player4);
      playerId = player4.id
      playerJSON = JSON.stringify({ playerId })

      codedPlayerData = {
        Code: 4,
        wsm: playerJSON
      }

      // console.log("Sending message:", messageData);
      ws.send(JSON.stringify(codedPlayerData));
      break;

    default:
      console.log(`Key "${event.key}" pressed, but no action is assigned.`);
      break;
  }
};

const barPlayer1 = { x: 0, y: 0, id: "player1", lives: 3, nickname: player1.nickname };
const barPlayer2 = { x: 0, y: 1, id: "player2", lives: 3, nickname: player2.nickname };
const barPlayer3 = { x: 9, y: 0, id: "player3", lives: 3, nickname: player3.nickname };
const barPlayer4 = { x: 9, y: 1, id: "player4", lives: 3, nickname: player4.nickname };

export const barPlayers = [barPlayer1, barPlayer2, barPlayer3, barPlayer4];

export const spawnBarPlayers = (playerNum) => {
  for (let i = 0; i < playerNum; i++) {
    const player = barPlayers[i];
    console.log("player.nickname", player.nickname)
    const vPlayerElement = createElement("div", {
      attrs: {
        class: `${player.id}`, // Give the player a unique class
        style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1
          };`, // Set the grid position
      },
    });

    // Create the lives text element, positioned one space to the right (x + 2)
    const vLivesText = createElement("div", {
      attrs: {
        class: `${player.id}-lives`, // Unique class for the lives text
        style: `grid-column-start: ${player.x + 2}; grid-row-start: ${player.y + 1
          }; position: absolute;`, // Position the text one column to the right
      },
      children: [`${player.nickname} - Lives: ${player.lives}`], // Display initial lives
    });

    // Render and append both player and lives elements to the game map
    const playerElement = render(vPlayerElement);
    const livesTextElement = render(vLivesText);

    document.querySelector(".gameMap").appendChild(playerElement);
    document.querySelector(".gameMap").appendChild(livesTextElement);
  }
};

// function to remove player lives if hit by explosion, if all lives lost then removal from map
// also updates the scoreboard and players array and triggers endGame if a winner is found
export function removeLife(player, gameMap) {
  // Find the player in the players array
  const playerIndex = players.findIndex((p) => p.id === player.id);

  if (playerIndex !== -1) {
    // Decrease the player's lives
    players[playerIndex].lives--;

    //add playerHit(x, y) and it's styling and setTimeout(() => , 200);
    const hitElement = playerHit(
      players[playerIndex].x + 1,
      players[playerIndex].y + 1
    );
    gameMap.appendChild(hitElement);
    setTimeout(() => {
      hitElement.remove(); // Remove the hit effect after 200ms
    }, 200);
  }

  // Update the player's lives display on the scoreboard
  const playerLivesElement = document.querySelector(`.${player.id}-lives`);
  if (playerLivesElement) {
    // Update the lives text inside the element, keeping the format
    playerLivesElement.textContent = `${player.nickname} - Lives: ${players[playerIndex].lives}`;
  }

  // Check if the player's lives are zero
  if (players[playerIndex].lives <= 0) {
    // Remove the player from the game map if lives are zero
    const playerElement = document.getElementById(`${player.id}`);
    if (playerElement) {
      `${player.id}`
      //add playerHit(x, y) and it's styling and setTimeout(() => , 200);

      playerElement.remove();
    }
    //Remove the player from the players array
    players.splice(playerIndex, 1); // If you want to completely remove the player
    if (playerIndex === 1) {
      console.log(`Game over! Player ${players[0].id[6]} wins!`);
      gameResults += `Game over! Player ${players[0].id[6]} wins!`;
      announceResults(gameResults);

      //eventually will call function to spawn something over gamemap?
    }
  }
}

function playerHit(x, y) {
  const vPlayerHit = createElement("div", {
    attrs: {
      class: "hit",
      style: `grid-column-start: ${x}; grid-row-start: ${y};`, // Set the grid position
    },
  });
  const playerHit = render(vPlayerHit);
  return playerHit;
}

function announceResults(results) {
  clearInterval(countdownInterval); // Stop the timer when the results are announced

  // Create a div to display the results
  const resultsDiv = document.createElement("div");
  resultsDiv.classList.add("game-results"); // Add the CSS class instead of inline styles

  // Create a paragraph for results text
  const resultsText = document.createElement("p");
  resultsText.innerHTML = results; // Use innerHTML to preserve line breaks

  // Append the results text to the results div
  resultsDiv.appendChild(resultsText);

  // Append the results div to the body
  document.body.appendChild(resultsDiv);



  // Remove the results div after 10 seconds
  setTimeout(() => {
    document.body.removeChild(resultsDiv); // Remove after 10 seconds

    // resets players
    players = []
    console.log("players should be empty here:", players)


    // restart back to name input room after 10 seconds
    initializeNameInputRoom()
    refreshChatRoom()
  }, 10000);

  // 
}
