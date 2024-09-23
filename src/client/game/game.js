// # Main game logic

export const handleKeyPress = (event) => {
    // Check which key is pressed
    switch (event.key) {
      case 'ArrowUp':
        console.log('ArrowUp pressed');
        movePlayerUp();
        break;
      case 'ArrowDown':
        console.log('ArrowDown pressed');
        movePlayerDown();
        break;
      case 'ArrowLeft':
        console.log('ArrowLeft pressed');
        movePlayerLeft();
        break;
      case 'ArrowRight':
        console.log('ArrowRight pressed');
        movePlayerRight();
        break;
      case ' ':
        console.log('Spacebar pressed dropping bomb!');
        handleBombSpaceKey();
        break;
      default:
        console.log(`Key "${event.key}" pressed, but no action is assigned.`);
        break;
    }
  };

  
  const movePlayerUp = () => {
    console.log('Moving player up');
  };
  
  const movePlayerDown = () => {
    console.log('Moving player down');
  };
  const movePlayerLeft = () => {
    console.log('Moving player left');
  };
  const movePlayerRight = () => {
    console.log('Moving player right');
  };
  const handleBombSpaceKey = () => {
    console.log('Player dropped a bomb!');
  };