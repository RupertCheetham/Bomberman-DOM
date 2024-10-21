import createElement from "../../vdom/createElement";


export const chatContainerElement = () => {
    // Create the chat heading
    const chatHeading = createElement("h2", {
        attrs: {
            style: "color: #333; font-family: Arial, sans-serif;"
        },
        children: ["Chat"]
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
                padding: 15px; 
                margin-bottom: 15px; 
                border: 1px solid #ddd; 
                box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05); 
                color: #333;
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
                border-radius: 4px; 
                box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); 
                margin-right: 10px;
            `
        }
    });

    // Create the send button
    const sendButton = createElement("button", {
        attrs: {
            onclick: "sendMessage()",
            style: `
                padding: 10px 20px; 
                background-color: #007bff; 
                color: white; 
                border: none; 
                border-radius: 4px; 
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

    // Create the main chat container
    const chatContainer = createElement("div", {
        attrs: {
            id: "chat-container",
            style: `
                border-top: 1px solid #ccc; 
                padding: 15px; 
                background-color: #f9f9f9; 
                border-radius: 8px; 
                max-width: 600px; 
                margin: 0 auto; 
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            `
        },
        children: [chatHeading, chatDisplay, inputContainer]
    });

    // Render the chat container and return it
    return chatContainer;
};