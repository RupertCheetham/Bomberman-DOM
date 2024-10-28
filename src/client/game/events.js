
import { bombElement } from "../components/bombElement";
import { spawnExplosion } from "../components/explosionElement";
import { removeLife, startGameTimer } from "../game/game";
import { initializeApp } from "../..";
import { currentPlayerId } from "../websocket/chat";
import { ws } from "../websocket/chat";

export const bombLocations = []

export const bombCooldowns = {
    player1: { count: 0, cooldown: false },
    player2: { count: 0, cooldown: false },
    player3: { count: 0, cooldown: false },
    player4: { count: 0, cooldown: false }
};


//every player can drop one bomb in a 3 second period 
//or if they have the bomb power up then they can drop 2 in that perriod
export function spawnBomb(player) {

    const playerCooldown = bombCooldowns[player.id];

    // If the player is on cooldown and has no bombs left to drop, block bomb placement
    if (playerCooldown.cooldown && playerCooldown.count === 1 && !player.hasPowerUpBomb) {
        console.log(`${player.id} is on cooldown! Wait 3 seconds to drop another bomb.`);
        return;
    }

    // If player hasPowerUpBomb and is allowed to drop a second bomb
    if (player.hasPowerUpBomb && playerCooldown.count >= 2) {
        console.log(`${player.id} can only drop a maximum of 2 bombs within 3 seconds.`);
        return;
    }


    const x = player.x + 1
    const y = player.y + 1
    console.log("player", player.id, "at tile X:", player.x + 1, " , Y:", player.y + 1)
    const bombLocation = { x: player.x, y: player.y };
    console.log("Bomb location:", bombLocation);
    bombLocations.unshift(bombLocation)
    const bomb = bombElement(x, y)
    const gameMap = document.querySelector('.gameMap')

    gameMap.appendChild(bomb);


    // Increase bomb count for the player
    playerCooldown.count++;

    // If it's the player's first bomb, start cooldown
    if (playerCooldown.count === 1) {
        playerCooldown.cooldown = true;

        setTimeout(() => {
            // Reset the player's bomb count and cooldown after 3 seconds
            playerCooldown.cooldown = false;
            playerCooldown.count = 0;
            console.log(`${player.id} can now drop a new bomb.`);
        }, 3000);
    }


    // Remove the bomb after 3 seconds
    setTimeout(() => {
        if (player.x === bombLocation.x && player.y === bombLocation.y) {
            console.log("true")
            removeLife(player, gameMap);
        }
        bomb.remove();  // This removes the bomb from the DOM
        bombLocations.pop()
        console.log("Bomb removed after 3 seconds");
        spawnExplosion(player, x, y)

    }, 3000);  // Delay of 3 seconds

}

export function handleStartGame() {
    // Start the game timer for 5 minutes (300 seconds) when the page loads

    const gameDuration = 20; // 5 minutes in seconds
    startGameTimer(gameDuration)

    let playerNum = 3
    initializeApp(playerNum)
}

export function handleSendButton(event) {
    // if (!event.target.classList.contains("sendButton")) { return }
    if (event.target.id !== "sendButton") { return }

    const input = document.getElementById("message");
    const messageText = input.value.trim();

    if (!messageText) {
        console.warn("Cannot send an empty message.");
        return;
    }

    // Ensure player ID is defined before sending
    if (!currentPlayerId) {
        console.warn("Cannot send message: currentPlayerId is undefined.");
        return;
    }

    // Construct the message data object
    const messageData = {
        playerId: currentPlayerId,
        text: messageText
    };

    console.log("Sending message:", messageData);
    ws.send(JSON.stringify(messageData)); // Send the message as a JSON object

    // Store the last message sent
    //lastSentMessage = messageText;

    //This is displayMessage that caused the issue of double messages
    // Display the message locally as "sent"
    //displayMessage(messageData, "sent"); 
    input.value = ''; // Clear input field
}