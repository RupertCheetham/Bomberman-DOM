// # Main game logic

/*
player 3 actions 'i' up, 'k' down, 'j' left, 'l' right, ';' drop bomb
player 4 actions '5' up, 't' down, 'r' left, 'y' right, 'u' drop bomb
*/

export const handleKeyPress = (event) => {
    // Check which key is pressed
    switch (event.key) {
      case 'ArrowUp':
        console.log('P1 - ArrowUp pressed');
        movePlayerUp(event);
        break;
      case 'ArrowDown':
        console.log('P1 - ArrowDown pressed');
        movePlayerDown(event);
        break;
      case 'ArrowLeft':
        console.log('P1 - ArrowLeft pressed');
        movePlayerLeft(event);
        break;
      case 'ArrowRight':
        console.log('P1 - ArrowRight pressed');
        movePlayerRight(event);
        break;
      case ' ':
        console.log('P1 - dropped a bomb!');
        handleBombSpaceKey(event);
        break;
      case 'w':
        console.log('P2 - ArrowUp pressed');
        movePlayerUp(event);
        break;
      case 's':
        console.log('P2 - ArrowDown pressed');
        movePlayerDown(event);
        break;
      case 'a':
        console.log('P2 - ArrowLeft pressed');
        movePlayerLeft(event);
        break;
      case 'd':
        console.log('P2 - ArrowRight pressed');
        movePlayerRight(event);
        break;
      case 'f':
        console.log('P2 - dropped a bomb!');
        handleBombSpaceKey(event);
        break;
      default:
        console.log(`Key "${event.key}" pressed, but no action is assigned.`);
        break;
    }
  };

  
  const movePlayerUp = (event) => {
    // logic needs to be added to actually make specific player character move around the map
    if (event.key === 'ArrowUp') {
      console.log('Moving player 1 up');
    } else if
      (event.key === 'w') {
      console.log('Moving player 2 up');
  };
}
  
  const movePlayerDown = (event) => {
      // logic needs to be added to actually make specific player character move around the map
      if (event.key === 'ArrowDown') {
        console.log('Moving player 1 down');
      } else if
        (event.key === 's') {
        console.log('Moving player 2 down');
    };
  };
  const movePlayerLeft = (event) => {
      // logic needs to be added to actually make specific player character move around the map
      if (event.key === 'ArrowLeft') {
        console.log('Moving player 1 left');
      } else if
        (event.key === 'a') {
        console.log('Moving player 2 left');
    };
  };
  const movePlayerRight = (event) => {
      // logic needs to be added to actually make specific player character move around the map
      if (event.key === 'ArrowRight') {
        console.log('Moving player 1 right');
      } else if
        (event.key === 'd') {
        console.log('Moving player 2 right');
    };
  };
  const handleBombSpaceKey = (event) => {
      // logic needs to be added to actually make specific player character move around the map
      if (event.key === ' ') {
        console.log('Player 1 dropped a bomb!');
      } else if
        (event.key === 'f') {
        console.log('Player 2 dropped a bomb!');
    };
  };