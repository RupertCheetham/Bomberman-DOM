import { gameMap } from "../client/game/map";

export const createGameApp = (playerNum) => {
    return {
        tagName: 'div',
        attrs: {
            id: 'root',
            class: 'bomberman',
        },
        children: [
            gameMap(playerNum)
        ]
    };
};