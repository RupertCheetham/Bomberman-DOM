import createElement from "../../vdom/createElement"
import render from "../../vdom/render"


export function waitingRoomElement(){
    const vWaitingRoom = createElement("div", {
        attrs: {
            class: "waitingRoom",
        }
    })

    const waitingRoom = render(vWaitingRoom)
    return waitingRoom
}