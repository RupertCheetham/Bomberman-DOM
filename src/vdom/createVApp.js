import { createGameMap } from "./components/createGameMap";

export const createVApp = () => {
    return {
        tagName: 'div',
        attrs: {
            id: 'root',
            class: 'bomberman',
        },
        children: [
            createGameMap()
        ]
    };
};