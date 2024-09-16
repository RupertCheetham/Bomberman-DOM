import createElement from "../../vdom/createElement";

const map = `
+++++++++++++++
+++++++++++++++
HHHHHHHHHHHHHHH
H.............H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
H.S.S.S.S.S.S.H
H.............H
HHHHHHHHHHHHHHH
`;

// Function to create the gameMap element
export const gameMap = () => {

    // Split the map into rows and columns
    let rows = map.trim().split("\n").map((line) => [...line]);

    // Generate the map elements based on the symbols
    const mapElements = rows.flatMap((row) => 
        row.map((cell) => {
            let className;

            // Determine the class based on the cell symbol
            switch (cell) {
                case 'H':  // Hard Block/Wall
                    className = "hard-block";
                    break;
                case 'S':  // Soft Block/Destructible Wall
                    className = "soft-block";
                    break;
                case '+':  // Banner
                    className = "banner";
                    break;
                case '.':  // Empty space
                    className = "ground";
                    break;
                case '@':  // Player (if placed in map)
                    className = "player";
                    break;
                default:
                    className = "unknown";  // Fallback for unknown symbols
                    break;
            }

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
