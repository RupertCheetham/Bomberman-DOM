// chat goes here
// Below is copied from index.html, need (small?) refactor
import { spawnBomb } from "../game/events";
import { addPlayer, players, updatePlayerPosition } from "../game/game";

export const ws = new WebSocket("ws://localhost:8080/ws");
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

    const playerId = parsedMessage.playerId || messageData.playerId;
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
    const player = players.find(p => p.id === `player${currentPlayerId}`);
    playerIdElement.innerText = `${player.nickname}:`;

    playerIdElement.innerText = `${player.nickname}:`;
    console.log("playerIdElement", playerIdElement)

    currentPlayerId === playerId
    console.log("currentPlayerID", currentPlayerId)

    // Add a line break for better formatting
    const lineBreak = document.createElement("br");

    // Create the message content element
    const messageContent = document.createElement("p");
    messageContent.innerText = messageText;

    // Append player ID, line break, and message content to the message div
    message.appendChild(playerIdElement);
    message.appendChild(lineBreak);
    message.appendChild(messageContent);

    console.log("playerIdElement", playerIdElement)
    console.log("messageContent", messageContent)


    chat.appendChild(message);
    console.log("message", message)
    chat.scrollTop = chat.scrollHeight; // Auto-scroll to the bottom

    // Log details for debugging
    console.log(`Message displayed [${messageType}]:`, `Player ${playerId}: ${messageText}`);
}


ws.onmessage = function (event) {
    const messageData = JSON.parse(event.data); // Expecting { "playerId": 1, "text": "Hello" }
    console.log("Message received:", messageData); // Log the incoming message


    switch (messageData.code) {
        case 1:
            console.log(1)
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
            console.log("player", playerId, "is at X:", playerPOSObject.x, " Y: ", playerPOSObject.y)
            let foundPlayer = players.find(player => player.id === playerId);
            foundPlayer.x = playerPOSObject.x
            foundPlayer.y = playerPOSObject.y
            updatePlayerPosition(foundPlayer)
            return;
        case 4:
            // player drop bomb
            let playerBombObject = JSON.parse(messageData.wsm)
             playerId = playerBombObject.playerId
             console.log("bomb wsm", messageData.wsm)

console.log("BOMB")
            foundPlayer = players.find(player => player.id === playerId);
            console.log("foundPlayer", foundPlayer)
            spawnBomb(foundPlayer)
            return;
        case 5:
            // player lives... May be unnecessary 
            return;
        case 6:
            // player power up data
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
        console.log("Player ID assigned:", currentPlayerId);
    }

    displayMessage(messageData, messageType); // Display the message with the correct type
};

