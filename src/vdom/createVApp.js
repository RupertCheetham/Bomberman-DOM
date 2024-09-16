import { gameMap } from "../client/game/map";

export const createVApp = () => {
    return {
        tagName: 'div',
        attrs: {
            id: 'root',
            class: 'bomberman',
        },
        children: [
            gameMap()
        ]
    };
};