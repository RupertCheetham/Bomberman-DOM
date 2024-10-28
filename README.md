bomberman-dom/

Websocket Codes

1 - Adding/Receiving Player
3 - Chat Message


│
├── public/
│   ├── index.html                # Entry point for the game
│   └── assets/                   # Static assets like images, sounds, etc.
│       ├── images/
│       └── sounds/
│
├── src/
│   ├── client/
│   │   ├── components/           # UI components
│   │   ├── game/                 # Game logic and state management
│   │   │   ├── map.js            # Map generation and management
│   │   │   ├── player.js         # Player logic
│   │   │   ├── powerups.js       # Power-up logic
│   │   │   └── game.js           # Main game logic
│   │   ├── utils/                # Utility functions
│   │   ├── websocket/            # WebSocket handling (client-side)
│   │   │   └── chat.js           # Chat logic
│   │   ├── styles/               # CSS or other styling files
│   │   └── index.js              # Main entry point for the client-side code
│   │
│   ├── server/
│   │   ├── main.go               # Main entry point for the server
│   │   ├── websocket/            # WebSocket handling (server-side)
│   │   │   ├── server.go         # Server-side WebSocket logic
│   │   │   └── game_manager.go   # Game state and player management
│   │   └── utils/                # Utility functions for the server
│   │
│   └── config/                   # Configuration files (e.g., port numbers)
│
├── tests/                        # Unit and integration tests
│   ├── client/
│   └── server/
│
├── .gitignore                     # Git ignore file
├── package.json                  # Project dependencies and scripts (if applicable)
└── README.md                     # Project documentation



Symbols for map gen:

1. H - Hard Block/Wall
2. S - Softblock/destructible wall
3. + - Banner at top
4. @ - Player


5. b - Bombs, dropped by players, not on map
6. * - explosion, caused by bomb, not on map
