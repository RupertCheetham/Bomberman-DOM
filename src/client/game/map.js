import createElement from "../../vdom/createElement";

const map = `
+++++++++++++++
+++++++++++++++
HHHHHHHHHHHHHHH
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
H.H.H.H.H.H.H.H
H.............H
HHHHHHHHHHHHHHH
`;

const levelChars = {
    "+": "banner",
    "H": "hard-block",
    "S": "soft-block",
    ".": "ground",
    "1": "player1",
    "2": "player2",
    "3": "player3",
    "4": "player4",
}

// Function to create the gameMap element
export const gameMap = () => {

    // Split the map into rows and columns
    let rows = map.trim().split("\n").map((line) => [...line]);

    // Generate the map elements based on the symbols
    const mapElements = rows.flatMap((row) =>
        row.map((cell) => {
            let className = levelChars[cell]

            // Create the individual cell
            return createElement("div", {
                attrs: {
                    class: `cell ${className}`
                }
            });
        })
    );

    // Create the full map container with direct child cells
    return createElement("div", {
        attrs: {
            class: "gameMap",
        },
        children: mapElements
    });
}