import createElement from "../../vdom/createElement";
import render from "../../vdom/render";
import { chatContainerElement } from "./chatContainerElement";

// Function to create the waiting room element
export const waitingRoomElement = () => {
    
    // Wrap the waiting room inside the main root container
    const $waitingRoomElement = render(createElement("div", {
        attrs: {
            id: "root",
            class: "bomberman",
        },
        children: [ chatContainerElement()],
    }));
   
    return $waitingRoomElement;
};
