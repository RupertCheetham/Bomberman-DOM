import { getVApp, setVApp, $rootEl, updateRootEl } from "..";
import { createGameMap } from "./createGameMap";
import diff from "./diff";

export function updateVApp(...toDoList) {

    // Generate the new virtual DOM representation
    const currentVApp = getVApp();
    const vNewApp = createGameMap([...toDoList]);

    // Calculate the difference and patch the DOM
    const patch = diff(currentVApp, vNewApp);
    const newRootEl = patch($rootEl);

    // Update the root element and the virtual app state
    updateRootEl(newRootEl);
    setVApp(vNewApp);
    
}