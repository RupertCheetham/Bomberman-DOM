import createElement from "../../vdom/createElement";

const map = `
+++++++++++++++
+++++++++++++++
HHHHHHHHHHHHHHH
H@..S.........H
H.S.H.S.S.S.S.H
H...S.........H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.H.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
HHHHHHHHHHHHHHH
`;

const levelChars = {
    "+": "banner",
    "H": "hard-block",
    "S": "soft-block",
    ".": "ground",
    "@": "player-bomberman",
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