
import { bombElement } from "../components/bombElement";
import { spawnExplosion } from "../components/explosionElement";

//export function handlePlayer1(){
export function spawnBomb(player) {
    const x = player.x + 1
    const y = player.y + 1
    console.log("player", player.id, "at tile X:", player.x +1, " , Y:", player.y +1)

    const bomb = bombElement(x, y)
    document.querySelector('.gameMap').appendChild(bomb);
    // Remove the bomb after 3 seconds
    setTimeout(() => {
        bomb.remove();  // This removes the bomb from the DOM
        console.log("Bomb removed after 3 seconds");
        spawnExplosion(x, y)

    }, 3000);  // Delay of 3 seconds

}

