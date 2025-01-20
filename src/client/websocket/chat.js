// chat goes here
// Below is copied from index.html, need (small?) refactor
import { setGameStateNeedsUpdating } from "../..";
import { spawnBomb } from "../game/events";
import { addPlayer, players, updatePlayerPosition } from "../game/game";


// const serverIP = location.hostname === 'localhost' ? '192.168.153.149' : location.hostname;
// export const ws = new WebSocket(`ws://${serverIP}:8080/ws`);
export const ws = new WebSocket(`ws://${location.hostname}:8080/ws`);

console.log("location.hostname", location.hostname)
console.log(`ws://${location.hostname}:8080/ws`)

// export const ws = new WebSocket('ws://192.168.153.149:8080/ws');


//export const ws = new WebSocket("ws://localhost:8080/ws");

export let currentPlayerId; // Declare without initializing

function displayMessage(messageData, messageType) {
    // Parse messageData.text if it's in stringified JSON format
    let parsedMessage;
    try {
        parsedMessage = JSON.parse(messageData.text); // Expecting {"playerId": 1, "text": "Hello World"}
    } catch (e) {
        console.warn("Message is not in JSON format:", messageData.text);
        parsedMessage = { playerId: messageData.playerId, text: messageData.text }; // Fallback to use messageData directly
    }
console.log("messageData:", messageData)
    const playerId = parsedMessage.playerId || messageData.playerId;
    const playerNickname = parsedMessage.playerNickname || messageData.playerNickname;
    const messageText = parsedMessage.text || messageData.text;

    // Prevent displaying empty messages
    if (!messageText.trim()) {
        console.warn("Attempted to display an empty message.");
        return; // Exit the function if the message is empty
    }


    // const vChat = createElement("div", { attrs: { class: "chat" } })
    // const $Chat = render(vChat)
    const chat = document.getElementById("chat");

    // const vMessage = createElement("div", { attrs: { class: "message" } })
    // const $Message = render(vMessage)
    const message = document.createElement("div");
    message.classList.add("message", messageType); // Use messageType for styling

    // Create a bold playerId element (e.g., "Player 1:")
    //const vPlayerIdElement = createElement("strong", { attrs: { class: "chat" }, children: [`Player ${playerId}:`] })
    //const $PlayerIdElement = render(vPlayerIdElement)
    const playerIdElement = document.createElement("strong");
    playerIdElement.innerText = `${playerNickname}:`;

    currentPlayerId === playerId

    // Add a line break for better formatting
    const lineBreak = document.createElement("br");

    // Create the message content element
    const messageContent = document.createElement("p");
    messageContent.innerText = messageText;

    // Append player ID, line break, and message content to the message div
    message.appendChild(playerIdElement);
    message.appendChild(lineBreak);
    message.appendChild(messageContent);


    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight; // Auto-scroll to the bottom

    // Log details for debugging
}


ws.onmessage = function (event) {
    const messageData = JSON.parse(event.data); // Expecting { "playerId": 1, "text": "Hello" }


    switch (messageData.code) {
        case 1:
            let playerData = JSON.parse(event.data)
            if (playerData.playerId !== currentPlayerId) {
                addPlayer(playerData.playerId, playerData.nickname)
            }
            return
        case 2:
            messageData.players.forEach(newPlayer => {
                const playerExists = players.some(player => player.id === `player${newPlayer.playerId}`);
                if (!playerExists) {
                    addPlayer(newPlayer.playerId, newPlayer.nickname);
                }

            });
            return;
        case 3:
            // player position
            let playerPOSObject = JSON.parse(messageData.wsm)
            let playerId = playerPOSObject.playerId
            let foundPlayer = players.find(player => player.id === playerId);
            foundPlayer.x = playerPOSObject.x
            foundPlayer.y = playerPOSObject.y
            updatePlayerPosition(foundPlayer)
            setGameStateNeedsUpdating(true)
            return;
        case 4:
            // player drop bomb
            let playerBombObject = JSON.parse(messageData.wsm)
            playerId = playerBombObject.playerId

            foundPlayer = players.find(player => player.id === playerId);
            spawnBomb(foundPlayer)
            return;
        case 5:
            // player power ups
            console.log(5)
            let playerPowerUpObject = JSON.parse(messageData.wsm)
            playerId = playerPowerUpObject.playerId
            console.log("playerId", playerId)
            console.log("powerUp", playerPowerUpObject.powerUp)
            foundPlayer = players.find(player => player.id === playerId);
            const powerUpElement = document.getElementsByClassName(playerPowerUpObject.powerUp)[0]

            switch (playerPowerUpObject.powerUp) {
                case "hasPowerUpBomb":
                    foundPlayer.hasPowerUpBomb = true
                    break;
                case "hasPowerUpFlames":
                    foundPlayer.hasPowerUpFlames = true
                    break;
                case "hasPowerUpSpeed":
                    foundPlayer.hasPowerUpSpeed = true
                    break;
                default:
                    break;
            }
            powerUpElement.remove()
            return;

        default:
            break;
    }




    // Determine if the message is "sent" or "received"
    let messageType;
    if (messageData.playerId === currentPlayerId) {
        messageType = "sent";
    } else {
        messageType = "received";
    }

    // If player ID is included, update currentPlayerId
    if (messageData.playerId && !currentPlayerId) {
        currentPlayerId = messageData.playerId;
    }

    displayMessage(messageData, messageType); // Display the message with the correct type
};

