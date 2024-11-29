import { getGameApp, setGameApp, $rootEl, updateRootEl } from "..";
import { createGameApp } from "./createGameApp";
import diff from "./diff";

export function updateGameApp(...toDoList) {

    // Generate the new virtual DOM representation
    const currentGameApp = getGameApp();
    const vNewApp = createGameApp([...toDoList]);

    // Calculate the difference and patch the DOM
    const patch = diff(currentGameApp, vNewApp);
    const newRootEl = patch($rootEl);

    // Update the root element and the virtual app state
    updateRootEl(newRootEl);
    setGameApp(vNewApp);
    
}