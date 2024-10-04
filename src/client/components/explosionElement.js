import createElement from "../../vdom/createElement";
import render from "../../vdom/render";

export function spawnExplosion(x, y) {
    const gameMap = document.querySelector('.gameMap');

    // Center explosion
    const explosionMidElement = explosionMid(x, y);
    gameMap.appendChild(explosionMidElement);

    // X-axis explosion beams
    const explosionRange = 2; // Define explosion range here
    for (let i = 1; i <= explosionRange; i++) {
        const explosionLeftElement = explosionX(x - i, y);
        const explosionRightElement = explosionX(x + i, y);
        const explosionUpElement = explosionY(x, y - i);
        const explosionDownElement = explosionY(x, y + i);

        gameMap.appendChild(explosionLeftElement);
        gameMap.appendChild(explosionRightElement);
        gameMap.appendChild(explosionUpElement);
        gameMap.appendChild(explosionDownElement);

        // Remove elements after 200ms
        setTimeout(() => {
            explosionLeftElement.remove();
            explosionRightElement.remove();
            explosionUpElement.remove();
            explosionDownElement.remove();
        }, 200);
    }

    // Remove the center explosion after 200ms
    setTimeout(() => {
        explosionMidElement.remove();
    }, 200);
}

function explosionMid(x, y) {
    const vExplosionMid = createElement("div", {
        attrs: {
            class: "explosion",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    })
    const explosionMid = render(vExplosionMid)
    return explosionMid
}

function explosionX(x, y) {
    const vExplosionX = createElement("div", {
        attrs: {
            class: "explosion explosionX",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    })
    const explosionX = render(vExplosionX)
    return explosionX
}

function explosionY(x, y) {
    const vExplosionY = createElement("div", {
        attrs: {
            class: "explosion explosionY",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    })
    const explosionY = render(vExplosionY)
    return explosionY
}