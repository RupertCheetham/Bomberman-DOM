import { players } from "../game/game";
import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

export const spawnChatTopBarPlayers = () => {
  const topBar = document.getElementById("top-bar"); // Get the top-bar element
  if (!topBar) {
    console.error("Element with id 'top-bar' not found!");
    return;
  }

  topBar.innerHTML = "";

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
                `,
      },
      children: [`${player.nickname}`], // Add nickname later
    });

    // Render the virtual DOM element
    const playerElement = render(vChatTopBarPlayerElement);
    // Append the rendered player element to the top-bar
    topBar.appendChild(playerElement);


    // const vPlayerCount = createElement("h2", {
    //   attrs: {
    //     id: "playerCount",
    //     style: `
    //             color: #333; 
    //             font-family: Arial, sans-serif; 
    //             text-align: center;
    //         `
    //   },
    //   children: [`Players: ${players.length}`]
    // });

    // const playerCountElement = render(vPlayerCount);
    // topBar.appendChild(playerCountElement)
  }
};
