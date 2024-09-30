import { gameMap } from "../client/game/map";

export const createVApp = (playerNum) => {
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