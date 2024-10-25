import { currentPlayerId } from "./chat";

export let ws

export function initializeWebSocket() {
    ws = new WebSocket("ws://localhost:8080/ws");

    ws.onmessage = function (event) {
        const messageData = JSON.parse(event.data); // Expecting { "playerId": 1, "text": "Hello" }
        console.log("Message received:", messageData); // Log the incoming message

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
}

// Refactor your existing displayMessage function here
function displayMessage(messageData, messageType) {
    let parsedMessage;
    try {
        parsedMessage = JSON.parse(messageData.text); // Expecting {"playerId": 1, "text": "Hello World"}
    } catch (e) {
        console.warn("Message is not in JSON format:", messageData.text);
        parsedMessage = { playerId: messageData.playerId, text: messageData.text }; // Fallback to use messageData directly
    }

    const playerId = parsedMessage.playerId || messageData.playerId;
    const messageText = parsedMessage.text || messageData.text;

    if (!messageText.trim()) {
        console.warn("Attempted to display an empty message.");
        return; // Exit the function if the message is empty
    }

    const chat = document.getElementsByClassName("chat")[0];
    const message = document.createElement("div");
    message.classList.add("message", messageType); // Use messageType for styling

    const playerIdElement = document.createElement("strong");
    playerIdElement.innerText = `Player ${playerId}:`;

    const lineBreak = document.createElement("br");

    const messageContent = document.createElement("p");
    messageContent.innerText = messageText;

    message.appendChild(playerIdElement);
    message.appendChild(lineBreak);
    message.appendChild(messageContent);

    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight; // Auto-scroll to the bottom

    console.log(`Message displayed [${messageType}]:`, `Player ${playerId}: ${messageText}`);
}
