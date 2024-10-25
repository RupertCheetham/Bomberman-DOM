import { allPlayers } from "../game/game";
import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

let playerNum = 3

let onlinePlayers = []; // Empty array to hold the online players

export const spawnChatTopBarPlayers = () => {

    const playerNum = 3; // Assume you have 3 players

    const topBar = document.getElementById('top-bar'); // Get the top-bar element
    if (!topBar) {
        console.error("Element with id 'top-bar' not found!");
        return;
    }

    // Loop through the players and add them to the top bar
    for (let i = 0; i < playerNum; i++) {
        const player = allPlayers[i]; // Get each player from allPlayers array

        // Add player to the onlinePlayers array
        onlinePlayers.push(player);

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
            children:[`Player ${player.id[6]}`] // Add nickname later
        });

        // Render the virtual DOM element
        const playerElement = render(vChatTopBarPlayerElement);

        // Append the rendered player element to the top-bar
        topBar.appendChild(playerElement);
    }

    console.log("Online players:", onlinePlayers); // Log the populated onlinePlayers array
};
