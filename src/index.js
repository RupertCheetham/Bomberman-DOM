import render from './vdom/render';
import mount from './vdom/mount';
import { createGameApp } from './vdom/createGameApp';
import { handleEvent } from './vdom/events/eventHelpers/handleEvent';
import { eventRegistry, registerEvent } from './vdom/events/eventHelpers/registerEvent';
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
let gameApp;
let animationFrameId;

// Getters and Setters for Virtual DOM
export const getGameApp = () => gameApp;
export const setGameApp = (newGameApp) => {
  gameApp = newGameApp;
};

export const initializeNameInputRoom = () => {
  Object.keys(eventRegistry).forEach(key => {
    delete eventRegistry[key];
  });

  cancelAnimationFrame(animationFrameId); // Stop any ongoing game loop
  $rootEl.innerHTML = ""
  $rootEl = mount($nameInputElement, $rootEl);
  // activate waiting room event listeners
  // registerEvent('click', handleStartGame);
  registerEvent('click', handleEnterButton);

  // Activate event handler
  window.onkeydown = handleEvent; // Global event handler
  window.onclick = handleEvent; // Global event handler
}

export const initializeWaitingRoom = () => {
  Object.keys(eventRegistry).forEach(key => {
    delete eventRegistry[key];
  });  


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
  Object.keys(eventRegistry).forEach(key => {
    delete eventRegistry[key];
  }); 


  setGameApp(createGameApp(players.length)); // Create initial gameApp
  $rootEl = mount(render(gameApp), $rootEl); // Mount the initial app

  spawnPlayers(players.length);
  spawnSoftBlocks();
  spawnBarPlayers(players.length);

  // Register events
  // Keydown
  registerEvent('keydown', handleKeyPress); // Keydown for Enter key to add items


  // Start the game loop
  requestAnimationFrame(gameLoop);
};


// Game loop function using requestAnimationFrame
const gameLoop = () => {
  renderFrame();

  // Request the next frame and save its ID
  animationFrameId = requestAnimationFrame(gameLoop); // Make sure animationFrameId is updated
};



// Function to render the current frame
const renderFrame = () => {
  const currentGameApp = getGameApp();
  const newGameApp = createGameApp(players.length); // Re-create gameApp with the updated state

  const patch = diff(currentGameApp, newGameApp);
  const newRootEl = patch($rootEl);

  setGameApp(newGameApp);  // Update to the latest gameApp state
  updateRootEl(newRootEl);  // Refresh root element in DOM
};

// Update the root element in the DOM
export function updateRootEl(newRootEl) {
  $rootEl = newRootEl; // Remove `let` to ensure `$rootEl` is updated globally

  const oldRoot = document.getElementById('root');
  if (oldRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild($rootEl, oldRoot);
  } else {
    console.warn("Could not find old root element to replace");
  }
}


// Initialize the application
// initializeWaitingRoom()
initializeNameInputRoom()


