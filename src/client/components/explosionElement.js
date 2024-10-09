import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { checkCollision } from "../game/checkCollision";
import { softBlocks } from "../game/map";

export function spawnExplosion(x, y) {
    const gameMap = document.querySelector('.gameMap');

    // Center explosion
    const explosionMidElement = explosionMid(x, y);
    gameMap.appendChild(explosionMidElement);
     // Remove the center explosion after 200ms
     setTimeout(() => explosionMidElement.remove(), 200);

    const explosionRange = 2; // Explosion range can be adjusted

    // Handle explosions in each direction
    handleExplosionInDirection(x, y, explosionRange, 'left', gameMap);
    handleExplosionInDirection(x, y, explosionRange, 'right', gameMap);
    handleExplosionInDirection(x, y, explosionRange, 'up', gameMap);
    handleExplosionInDirection(x, y, explosionRange, 'down', gameMap);

   
}

function handleExplosionInDirection(x, y, range, direction, gameMap) {
    for (let i = 1; i <= range; i++) {
        let newX = x;
        let newY = y;

        // Determine new coordinates based on direction
        switch (direction) {
            case 'left':
                newX = x - i;
                break;
            case 'right':
                newX = x + i;
                break;
            case 'up':
                newY = y - i;
                break;
            case 'down':
                newY = y + i;
                break;
        }

        // Check for collision, including soft blocks
        if (checkCollision(newX, newY)) {
            // If it's a soft block, destroy it and stop the explosion in this direction
            const softBlock = softBlocks.find(block => block.x+1 === newX && block.y+1 === newY);
            if (softBlock) {
                destroySoftBlock(softBlock, gameMap);
            }
            break; // Stop the explosion in this direction
        }

        // Create and append the explosion element
        const explosionElement = (direction === 'up' || direction === 'down') 
            ? explosionY(newX, newY) 
            : explosionX(newX, newY);

        gameMap.appendChild(explosionElement);
        
   //     Remove the explosion element after 200ms
       setTimeout(() => explosionElement.remove(), 200);
    }
}

function explosionMid(x, y) {
    const vExplosionMid = createElement("div", {
        attrs: {
            class: "explosion",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    });
    const explosionMid = render(vExplosionMid);
    return explosionMid;
}

function explosionX(x, y) {
    const vExplosionX = createElement("div", {
        attrs: {
            class: "explosion explosionX",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    });
    const explosionX = render(vExplosionX);
    return explosionX;
}

function explosionY(x, y) {
    const vExplosionY = createElement("div", {
        attrs: {
            class: "explosion explosionY",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    });
    const explosionY = render(vExplosionY);
    return explosionY;
}

function destroySoftBlock(softBlock, gameMap) {
    // Find and remove the soft block element
    const softBlockElement = gameMap.querySelector(`.soft-block.${softBlock.id}`);
    if (softBlockElement) {
        softBlockElement.remove();
    }
    
    // Update the softBlocks array
    const index = softBlocks.findIndex(block => block.id === softBlock.id);
    if (index !== -1) {
        softBlocks.splice(index, 1);
    }
}