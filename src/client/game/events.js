
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