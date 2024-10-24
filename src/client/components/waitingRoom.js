import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { chatContainerElement } from "./chatContainerElement";
import { spawnChatTopBarPlayers } from "./chatPlayerCountAndTimer";

// const waitingRoomMap = `
// +++++++++++++++
// +++++++++++++++
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// ...............
// `;

// const levelChars = {
//     "+": "banner",
//     ".": "ground",
// };

// Parse the map into a 2D array
// const parsedMap = waitingRoomMap.trim().split("\n").map((line) => [...line]);

// Function to create the waiting room element
export const waitingRoomElement = () => {
    // Generate the map elements based on the symbols
    // const mapElements = parsedMap.flatMap((row) =>
    //     row.map((cell) => {
    //         const className = levelChars[cell];
    //         // Create the individual cell
    //         return createElement("div", {
    //             attrs: {
    //                 class: `cell ${className}`
    //             }
    //         });
    //     })
    // );

    // Create the waiting room container with map elements
    // const vWaitingRoom = createElement("div", {
    //     attrs: {
    //         class: "waitingRoom",
    //     },
    //     children: mapElements, 
    // });

    // Wrap the waiting room inside the main root container
    const $waitingRoomElement = render(createElement("div", {
        attrs: {
            id: "root",
            class: "bomberman",
        },
        children: [ chatContainerElement()],
    }));
   
    return $waitingRoomElement;
};
