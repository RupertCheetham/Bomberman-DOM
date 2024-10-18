
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

// export function handleGameEnd() {

//     //case 1
//     // if timer = 0 check player array for who has the most lives
//     //console.log("that player wins")
//     //if it's a draw then 
//     //console.log("it's a draw")

//     //case 2
//     //if player array.length === 1 then 
//     //console.log("that player wins")

//     //add function to removeLife so that if any life is lost then we run the function to check the array length
    
    
// }
