import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

//export function handlePlayer1(){
export function spawnBomb(player) {
    console.log("player", player)
    const vBomb = createElement("div", {
        attrs: {
            class: "bomb",
            style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1};` // Set the grid position
        }
    })
    const bomb = render(vBomb)
    document.querySelector('.gameMap').appendChild(bomb);
    // Remove the bomb after 3 seconds
    setTimeout(() => {
        bomb.remove();  // This removes the bomb from the DOM
        console.log("Bomb removed after 3 seconds");
    }, 3000);  // Delay of 3 seconds

}