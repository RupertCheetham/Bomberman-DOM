import createElement from "../createElement";

// Function to create the footer element
export const createGameMap = () => createElement("div", {
    attrs: {
        class: "gameMap",
    },
    children: [
        createElement("div", {
            attrs: {
                class: "wall-block"
            },
        }),
    ],

}
)
