
import { bombElement } from "../components/bombElement";
import { spawnExplosion } from "../components/explosionElement";
import { removeLife } from "../game/game";
import { initializeApp } from "../..";

export const bombLocations = []
export let countdownInterval; // Declare the interval globally



//export function handlePlayer1(){
export function spawnBomb(player) {
    const x = player.x + 1
    const y = player.y + 1
    console.log("player", player.id, "at tile X:", player.x + 1, " , Y:", player.y + 1)
    const bombLocation = { x: player.x, y: player.y };
    console.log("Bomb location:", bombLocation);
    bombLocations.unshift(bombLocation)
    const bomb = bombElement(x, y)
    const gameMap = document.querySelector('.gameMap')

    gameMap.appendChild(bomb);

    // Remove the bomb after 3 seconds
    setTimeout(() => {
        if (player.x === bombLocation.x && player.y === bombLocation.y) {
            console.log("true")
            removeLife(player, gameMap);
        }
        bomb.remove();  // This removes the bomb from the DOM
        bombLocations.pop()
        console.log("Bomb removed after 3 seconds");
        spawnExplosion(x, y)

    }, 3000);  // Delay of 3 seconds

}

export function handleStartGame() {
    // Start the game timer for 5 minutes (300 seconds) when the page loads

    const gameDuration = 20; // 5 minutes in seconds
    startGameTimer(gameDuration);


    let playerNum = 3
    initializeApp(playerNum)
}

// Function to start the game timer on page load
const startGameTimer = (duration) => {
    const timerDisplay = document.querySelector(".game-timer");
    let timeRemaining = duration;

    countdownInterval = setInterval(() => {
        // Update the timer display
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        // Format minutes and seconds (e.g., 1:05)
        timerDisplay.innerHTML = `Time Remaining: ${minutes}:${seconds < 10 ? "0" : ""
            }${seconds}`;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            timerDisplay.innerHTML = "Time's up! Game Over!";

            // Trigger any game-ending logic here
            endGame();
            initializeWaitingRoom();
        }

        timeRemaining -= 1;
    }, 1000);
};

// Function to handle game end
const endGame = () => {
    console.log("playerNum", playerNum);

    // Declare spawnedPlayers variable outside the if statements
    let spawnedPlayers;

    // Determine the spawnedPlayers based on playerNum
    if (playerNum === 4) {
        spawnedPlayers = players; // All players
    } else if (playerNum === 3) {
        spawnedPlayers = players.slice(0, 3); // First 3 players
    } else if (playerNum === 2) {
        spawnedPlayers = players.slice(0, 2); // First 2 players
    }

    // Filter out players who still have lives
    const activePlayers = spawnedPlayers.filter((player) => player.lives > 0);
    console.log("Active players:", activePlayers);
    const eliminatedPlayers = players.filter((player) => player.lives === 0);

    // If no active players, all have been eliminated
    if (activePlayers.length === 0) {
        console.log("Game over! All players have been eliminated. It's a draw!");
        gameResults += "Game over! All players have been eliminated. It's a draw!";
    } else if (activePlayers.length === 1) {
        // If there's only one active player, they win
        console.log(`Game over! Player ${activePlayers[0].id[6]} wins!`);
        gameResults += "Game over! Player " + activePlayers[0].id[6] + " wins!";
    } else {
        // Check if all active players have the same number of lives
        const sameLives = activePlayers.every(
            (player) => player.lives === activePlayers[0].lives
        );

        if (sameLives) {
            // All active players draw
            const playerIds = activePlayers
                .map((player) => `Player ${player.id[6]}`)
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
                console.log(`Game over! Player ${winners[0].id[6]} wins!`);
                gameResults += "Game over! Player " + winners[0].id[6] + " wins!";
            } else {
                // Specific players who draw with the highest lives
                const playerIds = winners
                    .map((player) => `Player ${player.id[6]}`)
                    .join(" and ");
                console.log(`Game over! ${playerIds} draw!`);
                gameResults += "Game over! " + playerIds + " draw!";
            }
        }

        // Announce players who have been eliminated
        if (eliminatedPlayers.length > 0) {
            const eliminatedIds = eliminatedPlayers
                .map((player) => `Player ${player.id[6]}`)
                .join(", ");
            console.log(`Eliminated: ${eliminatedIds}`);
        }
    }

    announceResults(gameResults);
};
