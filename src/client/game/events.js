import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

//export function handlePlayer1(){
export function spawnBomb(player) {
    const vBomb = createElement("div", {
        attrs: {
            class: "bomb",
            style: `grid-column-start: ${player.x + 1}; grid-row-start: ${player.y + 1};` // Set the grid position
        }
    })
    const bomb = render(vBomb)
    document.querySelector('.gameMap').appendChild(bomb);


}