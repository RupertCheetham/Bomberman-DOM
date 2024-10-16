
import { bombElement } from "../components/bombElement";
import { spawnExplosion } from "../components/explosionElement";
import { gameMap } from "./map";
import { removeLife } from "../game/game"; 

export const bombLocations = []


//export function handlePlayer1(){
export function spawnBomb(player) {
    const x = player.x + 1
    const y = player.y + 1
    console.log("player", player.id, "at tile X:", player.x +1, " , Y:", player.y +1)
    const bombLocation = { x: player.x, y: player.y}; 
    console.log("Bomb location:", bombLocation); 
    bombLocations.unshift(bombLocation)
    const bomb = bombElement(x, y)
    document.querySelector('.gameMap').appendChild(bomb);

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

