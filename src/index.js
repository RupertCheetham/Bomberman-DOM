import render from './vdom/render';
import mount from './vdom/mount';
import { createVApp } from './vdom/createVApp';
import { handleEvent } from './vdom/events/eventHelpers/handleEvent';
import { registerEvent } from './vdom/events/eventHelpers/registerEvent';
import { handleKeyPress, players, spawnBarPlayers } from './client/game/game.js';
import { spawnPlayers } from './client/game/game.js';
import diff from './vdom/diff.js';
import { spawnSoftBlocks } from './client/game/map.js';
import { waitingRoomElement } from './client/components/waitingRoom.js';
import { handleSendButton } from './client/game/events.js';
import { $nameInputElement } from './client/components/nameInputRoom.js';
import { handleEnterButton } from './client/game/events.js';
import { spawnChatTimerBarCountdown } from './client/components/chatPlayerTimerBarCountdown.js';
import { spawnChatTopBarPlayers } from './client/components/chatTopBarPlayers.js';

let $rootEl = document.getElementById('root');
let vApp;
let lastTime = 0;  // To track the time difference for game updates

// Getters and Setters for Virtual DOM
export const getVApp = () => vApp;
export const setVApp = (newVApp) => {
  vApp = newVApp;
};

export const initializeNameInputRoom = () => {

  $rootEl.innerHTML = ""
console.log("here")
  $rootEl = mount($nameInputElement, $rootEl);
  // activate waiting room event listeners
  // registerEvent('click', handleStartGame);
  registerEvent('click', handleEnterButton);

  // Activate event handler
  window.onkeydown = handleEvent; // Global event handler
  window.onclick = handleEvent; // Global event handler
  window.ondblclick = handleEvent; // Global event handler
}

export const initializeWaitingRoom = () => {

  $rootEl = mount(waitingRoomElement(), $rootEl);
  //registerEvent('click', handleStartGame);
  // Activate event handlers
  window.onkeydown = handleEvent; // Global event handler
  window.onclick = handleEvent; // Global event handler
  window.ondblclick = handleEvent; // Global event handler
  // window.onmessage = handleEvent; // Global event handler
  registerEvent('click', handleSendButton);
  spawnChatTopBarPlayers()
  spawnChatTimerBarCountdown()
}

// Initialize Application
export const initializeApp = () => {
  setVApp(createVApp(players.length)); // Create initial VApp
  $rootEl = mount(render(vApp), $rootEl); // Mount the initial app

  spawnPlayers(players.length);
  console.log("playerNum", players.length)
  spawnSoftBlocks();
  spawnBarPlayers(players.length);

  // Register events
  // Keydown
  registerEvent('keydown', handleKeyPress); // Keydown for Enter key to add items
  // // Click
  // registerEvent('click', (event) => handleClickDelete(event, toDoList))
  // // Double Click
  // registerEvent('dblclick', (event) => handleDoubleClickEdit(event, toDoList));

  // Start the game loop
  requestAnimationFrame(gameLoop);
};


// Game loop function using requestAnimationFrame
const gameLoop = (timestamp) => {
  const deltaTime = timestamp - lastTime; // Calculate the time difference
  lastTime = timestamp;
  updateGameState(deltaTime);  // Update the game state
  renderFrame();  // Re-render the virtual DOM
  // Recursively call gameLoop for the next frame
  requestAnimationFrame(gameLoop);
};

// Function to update the game state
const updateGameState = (deltaTime) => {
  // Handle game logic based on time passed (deltaTime)
  // Example: Move player, handle physics, check for collisions, etc.
  // Your game state updates would go here

  // Example: If using a player object
  // player.update(deltaTime);
};


// Function to render the current frame
const renderFrame = () => {
  let currentVApp = getVApp()
  const newVApp = createVApp(); // Create new virtual DOM representation based on updated state
  let patch = diff(currentVApp, newVApp)

  const newRootEl = patch($rootEl);
  setVApp(newVApp);  // Update the virtual DOM
  updateRootEl(newRootEl);  // Update the DOM
};

// Update the root element in the DOM
export function updateRootEl(newRootEl) {
  let $rootEl = newRootEl; // Update the reference
  const oldRoot = document.getElementById('root');

  if (oldRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild($rootEl, oldRoot); // Replace the old root element with the new one
  } else {
    console.warn("Could not find old root element to replace");
  }
}

// Initialize the application
// initializeWaitingRoom()
initializeNameInputRoom()


