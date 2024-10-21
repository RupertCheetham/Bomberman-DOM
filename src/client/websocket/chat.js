// chat goes here
// Below is copied from index.html, need (small?) refactor

const ws = new WebSocket("ws://localhost:8080/ws");
let currentPlayerId; // Declare without initializing

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
    const chat = document.getElementsByClassName("chat")[0];

   // const vMessage = createElement("div", { attrs: { class: "message" } })
   // const $Message = render(vMessage)
    const message = document.createElement("div");
    message.classList.add("message", messageType); // Use messageType for styling

    // Create a bold playerId element (e.g., "Player 1:")
    //const vPlayerIdElement = createElement("strong", { attrs: { class: "chat" }, children: [`Player ${playerId}:`] })
    //const $PlayerIdElement = render(vPlayerIdElement)
    const playerIdElement = document.createElement("strong");
    playerIdElement.innerText = `Player ${playerId}:`;

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
    console.log(`Message displayed [${messageType}]:`, `Player ${playerId}: ${messageText}`);
}


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


function sendMessage() {
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
