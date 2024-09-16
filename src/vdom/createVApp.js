import { gameMap } from "../client/game/map";

export const createVApp = () => {
    console.log("here")
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