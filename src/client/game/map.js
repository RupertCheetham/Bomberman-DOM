import createElement from "../../vdom/createElement"

// Function to create the footer element
export const gameMap = () => createElement("div", {
    attrs: {
        class: "gameMap",
    },
    children: [
        createElement("div", {
            attrs: {
                class: "wall-block"
            },
        }),
        createElement("div", {
            attrs: {
                class: "wall-block"
            },
        }),
        createElement("div", {
            attrs: {
                class: "wall-block"
            },
        }),
        createElement("div", {
            attrs: {
                class: "wall-block"
            },
        }),
    ],

}
)
