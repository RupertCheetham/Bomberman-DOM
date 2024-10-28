export const createLivesDisplay = (player) => {
    const livesElement = createElement("div", {
      attrs: {
        class: `${player.id}-lives`, // Unique class for each player's lives display
        style: "margin: 10px;", // You can customize the style as needed
      },
      children: [`Player ${player.id} Lives: ${player.lives}`], // Display initial lives
    });
  };