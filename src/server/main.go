// package main

// import (
// 	"log"
// 	"net/http"

// 	"github.com/gorilla/websocket"
// )

// // Upgrade HTTP to WebSocket protocol
// var upgrader = websocket.Upgrader{
// 	ReadBufferSize:  1024,
// 	WriteBufferSize: 1024,
// 	CheckOrigin: func(r *http.Request) bool {
// 		return true // Allow connections from any origin
// 	},
// }

// // Client manager to store and broadcast messages
// type Client struct {
// 	conn     *websocket.Conn
// 	playerId int
// }

// var clients = make(map[*Client]bool)
// var broadcast = make(chan string)
// var maxClients = 4                         // Maximum number of clients
// var availablePlayerIds = []int{1, 2, 3, 4} // List of available player IDs

// func main() {

// 	// Start WebSocket server on /ws endpoint
// 	http.HandleFunc("/ws", handleConnections)

// 	// Start a goroutine to listen for new messages
// 	go handleMessages()

// 	// Start HTTP server on port 8080
// 	log.Println("Server started on :8080")
// 	err := http.ListenAndServe(":8080", nil)
// 	if err != nil {
// 		log.Fatal("ListenAndServe: ", err)
// 	}
// }

// // Handle incoming WebSocket connections
// func handleConnections(w http.ResponseWriter, r *http.Request) {
// 	if len(clients) >= maxClients {
// 		http.Error(w, "Server full", http.StatusForbidden)
// 		return // Reject new connections if max clients reached
// 	}

// 	// Upgrade initial GET request to a WebSocket
// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer ws.Close()

// 	// Assign an available player ID
// 	var playerId int
// 	if len(availablePlayerIds) > 0 {
// 		playerId = availablePlayerIds[0]            // Get the first available ID
// 		availablePlayerIds = availablePlayerIds[1:] // Remove it from the list
// 	} else {
// 		// Should not happen if we check maxClients properly
// 		return
// 	}

// 	// Register the new client
// 	client := &Client{conn: ws, playerId: playerId}
// 	clients[client] = true

// 	// Log the connection
// 	log.Printf("Player %d connected", playerId)

// 	// Listen for messages
// 	for {
// 		_, msg, err := ws.ReadMessage()
// 		if err != nil {
// 			log.Printf("error: %v", err)
// 			delete(clients, client)
// 			availablePlayerIds = append(availablePlayerIds, playerId) // Make the ID available again

// 			break
// 		}
// 		// Send the received message to the broadcast channel
// 		broadcast <- string(msg)
// 	}
// }

// // Handle broadcasting messages to all clients
// func handleMessages() {
// 	for {
// 		// Grab the next message from the broadcast channel
// 		msg := <-broadcast
// 		// Send the message to every client connected
// 		for client := range clients {
// 			//log.Println("clients", clients)
// 			err := client.conn.WriteMessage(websocket.TextMessage, []byte(msg))
// 			if err != nil {
// 				log.Printf("error: %v", err)
// 				client.conn.Close()
// 				delete(clients, client)
// 				availablePlayerIds = append(availablePlayerIds, client.playerId) // Make the ID available again
// 			}
// 		}
// 	}
// }

package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

// Upgrade HTTP to WebSocket protocol
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin
	},
}

// Client manager to store and broadcast messages
type Client struct {
	conn     *websocket.Conn
	playerId int
}

var clients = make(map[*Client]bool)
var broadcast = make(chan Message)
var maxClients = 4                         // Maximum number of clients
var availablePlayerIds = []int{1, 2, 3, 4} // List of available player IDs

// Message struct to handle structured messages
type Message struct {
	PlayerId int    `json:"playerId"`
	Text     string `json:"text"`
}

func main() {
	// Start WebSocket server on /ws endpoint
	http.HandleFunc("/ws", handleConnections)

	// Start a goroutine to listen for new messages
	go handleMessages()

	// Start HTTP server on port 8080
	log.Println("Server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

// Handle incoming WebSocket connections
func handleConnections(w http.ResponseWriter, r *http.Request) {
	if len(clients) >= maxClients {
		http.Error(w, "Server full", http.StatusForbidden)
		return // Reject new connections if max clients reached
	}

	// Upgrade initial GET request to a WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	// Assign an available player ID
	var playerId int
	if len(availablePlayerIds) > 0 {
		playerId = availablePlayerIds[0]            // Get the first available ID
		availablePlayerIds = availablePlayerIds[1:] // Remove it from the list
	} else {
		return
	}

	// Register the new client
	client := &Client{conn: ws, playerId: playerId}
	clients[client] = true

	// Log the connection
	log.Printf("Player %d connected", playerId)

	// Send the player ID to the client
	//initialMessage := Message{PlayerId: playerId, Text: "Welcome!"}
	initialMessage := Message{PlayerId: playerId}
	


	if err := ws.WriteJSON(initialMessage); err != nil {
		log.Printf("error: %v", err)
		return
	}

	// Listen for messages
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, client)
			availablePlayerIds = append(availablePlayerIds, playerId) // Make the ID available again
			break
		}

		log.Printf("Broadcasting message: %+v", msg)

		// Send the received message to the broadcast channel
		broadcast <- Message{PlayerId: client.playerId, Text: string(msg)}
	}
}

// Handle broadcasting messages to all clients
func handleMessages() {
	for {
		// Grab the next message from the broadcast channel
		msg := <-broadcast
		// Send the message to every client connected
		for client := range clients {
			err := client.conn.WriteJSON(msg) // Write the Message struct as JSON
			if err != nil {
				log.Printf("error: %v", err)
				client.conn.Close()
				delete(clients, client)
				availablePlayerIds = append(availablePlayerIds, client.playerId) // Make the ID available again
			}
		}
	}
}
