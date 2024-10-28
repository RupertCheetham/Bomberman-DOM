import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import logoSrc from "./images/BOMERMIN.png";

const logoDisplay = createElement("img", {
    attrs: {
        id: "logo",
        src: logoSrc, // Use the imported path
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
});


const vnameInputElement = () => {
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
                margin-bottom: 10px; /* Space between the bar and logo */
                border-radius: 8px;
            `
        },
        children: []
    });

    // Create the logo heading
    const logoHeading = createElement("h2", {
        attrs: {
            style: `
                color: #333; 
                font-family: Arial, sans-serif; 
                text-align: center;
            `
        },
        children: ["BOMERMIN"]
    });
    // Create the logo nickname display area
    const logoDisplay = createElement("img", {
        attrs: {
            id: "logo",
            src: logoSrc,
            style: `
                height: 300px; 
                overflow-y: auto; 
                display: flex;
                justify-content: center; 
                align-items: center; 
                background-color: #fff; 
                border-radius: 8px; 
                border: 1px solid #ddd; 
                box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05); 
                color: #333;
                margin: 0 auto;
                margin-bottom: 10px;
            `
        },
    });

    // Create the input field for typing nicknames
    const nicknameInput = createElement("input", {
        attrs: {
            type: "text",
            id: "nickname",
            placeholder: "Type your nickname here",
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
    const enterButton = createElement("button", {
        attrs: {
            class: "enterButton",
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
        children: ["Enter"]
    });

    // Create the container for the input and button
    const inputContainer = createElement("div", {
        attrs: {
            style: "display: flex;"
        },
        children: [nicknameInput, enterButton]
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
                margin-bottom: 10px; /* Space between the bar and logo */
                border-radius: 8px;
                margin-top: 10px;
                margin-left: auto; 
                margin-right: auto; /* This will center it horizontally */
            `
        },
        children: [] // Will be dynamically populated with 10 second countdown
    });


    // Create the main logo container
    const logoContainer = createElement("div", {
        attrs: {
            id: "logo-container",
            style: `
            width: 600px;
	height: 600px;
                border-top: 1px solid #ccc; 
                padding: 15px; 
                background-color: #f9f9f9; 
                border-radius: 8px; 
                align-items: center;
                max-width: 600px; 
                margin: 0 auto; 
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            `
        },
        children: [playerCounterBar, logoHeading, logoDisplay, inputContainer, timerBar]
    });

    return logoContainer;
};

export const $nameInputElement = render(createElement("div", {
    attrs: {
        id: "root",
        class: "bomberman",
    },
    children: [vnameInputElement()],
}));

return $nameInputElement;