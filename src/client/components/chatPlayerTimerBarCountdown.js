import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { handleStartGame } from "../game/events";
import { players } from "../game/game";
import { spawnChatTopBarPlayers } from "./chatTopBarPlayers";


export function spawnChatTimerBarCountdown() {

    let playerNum = players.length;
    console.log("players.length is", players.length);

    const timerBar = document.getElementById('timer-bar'); // Get the top-bar element
    if (!timerBar) {
        console.error("Element with id 'timer-bar' not found!");
        return;
    }

    timerBar.innerHTML = '';

    // Helper function for countdown
    const startCountdown = (duration, displayElement) => {
        let timeLeft = duration;
        const countdownInterval = setInterval(() => {
            displayElement.textContent = `${timeLeft} seconds remaining`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                handleStartGame();
            } else {
                timeLeft--;
            }
        }, 1000);
    };

    if (playerNum === 1) {
        const vSinglePlayerElement = createElement("div", {
            attrs: {
                style: `   
            color: #333; 
            font-family: Arial, sans-serif; 
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            `
            },
            children: ["Waiting for other players!"] // Add nickname later
        });

        const timerElement = render(vSinglePlayerElement);

        // Append the rendered player element to the top-bar
        timerBar.appendChild(timerElement);
    }

    if (playerNum === 2 || playerNum === 3) {
        const vTwoOrThreePlayerTimerElement = createElement("div", {
            attrs: {
                style: `   
            color: #333; 
            font-family: Arial, sans-serif; 
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            `
            },
            children: [] // needs 30 second timer
        });
        const timerElement = render(vTwoOrThreePlayerTimerElement);

        // Append the rendered player element to the top-bar
        timerBar.appendChild(timerElement);
        startCountdown(30, timerElement); // Start a 30-second countdown
    }

    if (playerNum === 4) {
        const vFourPlayerTimerElement = createElement("div", {
            attrs: {
                style: `   
            color: #333; 
            font-family: Arial, sans-serif; 
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            `
            },
            children: [] // needs 10 second timer
        });
        const timerElement = render(vFourPlayerTimerElement);

        // Append the rendered player element to the top-bar
        timerBar.appendChild(timerElement);
        startCountdown(10, timerElement); // Start a 10-second countdown
    }
}

export function refreshChatRoom() {

spawnChatTimerBarCountdown()
spawnChatTopBarPlayers()
    console.log("players.length is", players.length);

}


