//import { allPlayers } from "../game/game";
import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { handleStartGame } from "../game/events";
import { players } from "../game/game";


export const spawnChatTopBarPlayers = () => {

    const topBar = document.getElementById('top-bar'); // Get the top-bar element
    if (!topBar) {
        console.error("Element with id 'top-bar' not found!");
        return;
    }

    // Loop through the players and add them to the top bar
    for (let i = 0; i < players.length; i++) {
        const player = players[i]; // Get each player from players array

        // Create a virtual element for the top-bar player
        const vChatTopBarPlayerElement = createElement("div", {
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
            children:[`${player.nickname}`] // Add nickname later
        });

        // Render the virtual DOM element
        const playerElement = render(vChatTopBarPlayerElement);

        // Append the rendered player element to the top-bar
        topBar.appendChild(playerElement);
    }

    
};

//UPDATE CHATROOM FUNCTION NEEDED TO REFRESH ONLINE PLAYERS ARRAY AND TIMER RESETS

export function spawnChatTimerBarCountdown() {

let playerNum = players.length;    
console.log("players.length is", players.length);

const timerBar = document.getElementById('timer-bar'); // Get the top-bar element
if (!timerBar) {
    console.error("Element with id 'timer-bar' not found!");
    return;
}

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
        children:["Waiting for other players!"] // Add nickname later
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
        children:[] // needs 30 second timer
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
        children:[] // needs 10 second timer
    });
    const timerElement = render(vFourPlayerTimerElement);

    // Append the rendered player element to the top-bar
    timerBar.appendChild(timerElement);
    startCountdown(10, timerElement); // Start a 10-second countdown
}
}

export function refreshChatRoom() {

    spawnChatTopBarPlayers();
    spawnChatTimerBarCountdown();

    console.log("players.length is", players.length);

}


//need to change these timers back to 30 seconds (line 118) and 10 seconds (line 139)