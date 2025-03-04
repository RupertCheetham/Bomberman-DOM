import createElement from "../../vdom/createElement";
import { players } from "../game/game";

export const chatContainerElement = () => {
    // Create the top bar container for players
    const playerCounterBar = createElement("div", {
        attrs: {
            id: "top-bar",
            style: `
                width: 570px;
                height: 80px;
                background-color: #f78300;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-bottom: 10px; /* Space between the bar and chat */
                border-radius: 8px;
            `
        },
        children: []
    });

    const vPlayerCountElement = createElement("h3", {
         attrs: {
            id: "playerCount",
            style: `
                color: #333; 
                font-family: Arial, sans-serif; 
                text-align: center;
            `
        },
        children: [`Players: ${players.length}`]
    });

    // Create the chat message display area
    const chatDisplay = createElement("div", {
        attrs: {
            id: "chat",
            style: `
                height: 300px; 
                overflow-y: auto; 
                background-color: #fff; 
                border-radius: 8px; 
                border: 1px solid #ddd; 
                box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05); 
                color: #333;
                margin-bottom: 10px;
            `
        },
        children: [] // This will be dynamically populated with messages
    });

    // Create the input field for typing messages
    const messageInput = createElement("input", {
        attrs: {
            type: "text",
            id: "message",
            placeholder: "Type a message",
            style: `
                flex: 1; 
                padding: 10px; 
                border: 1px solid #ddd; 
                border-radius: 8px; 
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); 
                margin-right: 10px;
            `
        }
    });

    // Create the send button
    const sendButton = createElement("button", {
        attrs: {
            // onclick: "sendMessage()",
            id: "sendButton",
            style: `
                padding: 10px 20px; 
                background-color: #007bff; 
                color: white; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer; 
                transition: background-color 0.3s;
            `
        },
        children: ["Send"]
    });

    // Create the container for the input and button
    const inputContainer = createElement("div", {
        attrs: {
            style: "display: flex;"
        },
        children: [messageInput, sendButton]
    });

    const timerBar = createElement("div", {
        attrs: {
            id: "timer-bar",
            style: `
                width: 300px;
                height: 60px;
                background-color: #f78300;
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin-bottom: 10px; /* Space between the bar and chat */
                border-radius: 8px;
                margin-top: 10px;
                margin-left: auto; 
                margin-right: auto; /* This will center it horizontally */
            `
        },
        children: [] // Will be dynamically populated with 10 second countdown
    });


    // Create the main chat container
    const chatContainer = createElement("div", {
        attrs: {
            id: "chat-container",
            style: `
            width: 600px;
	height: 600px;
                border-top: 1px solid #ccc; 
                padding: 15px; 
                background-color: #f9f9f9; 
                border-radius: 8px; 
                max-width: 600px; 
                margin: 0 auto; 
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            `
        },
        children: [playerCounterBar, vPlayerCountElement, chatDisplay, inputContainer, timerBar]
    });

    return chatContainer;
};