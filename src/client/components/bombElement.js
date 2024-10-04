import createElement from "../../vdom/createElement"
import render from "../../vdom/render"


export function bombElement(x, y){
    const vBomb = createElement("div", {
        attrs: {
            class: "bomb",
            style: `grid-column-start: ${x}; grid-row-start: ${y};` // Set the grid position
        }
    })

    const bomb = render(vBomb)
    return bomb
}
