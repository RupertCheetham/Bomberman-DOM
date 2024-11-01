package main

import (
	"encoding/json"
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
	nickname string
}

type CodedMessage struct {
	Code int    `json:"code"` // Use JSON struct tags to match JSON keys
	Wsm  string `json:"wsm"`
}

type PlayerInfo struct {
	PlayerId int    `json:"playerId"` // Use JSON struct tags to match JSON keys
	Nickname string `json:"nickname"`
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

type PlayerPosition struct {
	PlayerId int     `json:"playerId"`	// Use JSON struct tags to match JSON keys
	X        int `json:"x"`			// Use JSON struct tags to match JSON keys						
	Y        int `json:"y"`			// Use JSON struct tags to match JSON keys							
}

type BombData struct {
	PlayerId int `json:"playerId"`
	Code int `json:"code"`
}

type PlayerLives struct {
	PlayerId int `json:"playerId"`
}

type PowerUpData struct {
	PlayerId int `json:"playerId"`
	HandleasPowerUpBomb bool `json:"hasPowerUpBomb"`
	HasPowerUpFlames bool `json:"hasPowerUpFlames"`
	HasPowerUpSpeed bool `json:"hasPowerUpSpeed"`
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

// Function to get all player IDs with nicknames
func getAllPlayerInfo() []PlayerInfo {
	var allPlayers []PlayerInfo
	for client := range clients {
		// holds off on adding client data if they haven't chosen a nickname yet
		if client.nickname != "" {
			allPlayers = append(allPlayers, PlayerInfo{
				PlayerId: client.playerId,
				Nickname: client.nickname,
			})
		}

	}
	return allPlayers
}

// Handle incoming WebSocket connections
// func handleConnections(w http.ResponseWriter, r *http.Request) {
// 	if len(clients) >= maxClients {
// 		http.Error(w, "Server full", http.StatusForbidden)
// 		return
// 	}

// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer ws.Close()

// 	var playerId int
// 	if len(availablePlayerIds) > 0 {
// 		playerId = availablePlayerIds[0]
// 		availablePlayerIds = availablePlayerIds[1:]
// 	} else {
// 		return
// 	}

// 	client := &Client{conn: ws, playerId: playerId}
// 	clients[client] = true
// 	log.Printf("Player %d connected", playerId)

// 	initialMessage := Message{PlayerId: playerId}
// 	if err := ws.WriteJSON(initialMessage); err != nil {
// 		log.Printf("error: %v", err)
// 		return
// 	}

// 	for {
// 		_, msg, err := ws.ReadMessage()
// 		if err != nil {
// 			log.Printf("error: %v", err)
// 			delete(clients, client)
// 			availablePlayerIds = append(availablePlayerIds, playerId)
// 			break
// 		}

// 		var decodedMSG CodedMessage
// 		err = json.Unmarshal(msg, &decodedMSG)
// 		if err != nil {
// 			log.Println("Error decoding message:", err)
// 			return
// 		}

// 		var playerInfo PlayerInfo

// 		if decodedMSG.Code == 1 {
// 			err := json.Unmarshal([]byte(decodedMSG.Wsm), &playerInfo)
// 			if err != nil {
// 				log.Println("Error decoding player info:", err)
// 				return
// 			}

// 			// Update the client's nickname
// 			client.nickname = playerInfo.Nickname
// 			log.Printf("Player %d set nickname to %s", client.playerId, client.nickname)

// 			// Get the list of all players and their nicknames
// 			allPlayers := getAllPlayerInfo()

// 			// Create the response message with the updated list
// 			playerListMessage := struct {
// 				Code    int          `json:"code"`
// 				Players []PlayerInfo `json:"players"`
// 			}{
// 				Code:    2, // Define 2 as the code for broadcasting player lists
// 				Players: allPlayers,
// 			}

// 			// Send the list to all clients except the sender
// 			for c := range clients {

// 				err := c.conn.WriteJSON(playerListMessage)
// 				if err != nil {
// 					log.Printf("error: %v", err)
// 					c.conn.Close()
// 					delete(clients, c)
// 					availablePlayerIds = append(availablePlayerIds, c.playerId)
// 				}

// 			}
// 			continue
// 		}

// 		// Normal message broadcast
// 		broadcast <- Message{PlayerId: client.playerId, Text: string(msg)}
// 	}
// }

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

func handleConnections(w http.ResponseWriter, r *http.Request) {
	if len(clients) >= maxClients {
		http.Error(w, "Server full", http.StatusForbidden)
		return
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	var playerId int
	if len(availablePlayerIds) > 0 {
		playerId = availablePlayerIds[0]
		availablePlayerIds = availablePlayerIds[1:]
	} else {
		return
	}

	client := &Client{conn: ws, playerId: playerId}
	clients[client] = true
	log.Printf("Player %d connected", playerId)

	// Send initial message to the new client
	initialMessage := Message{PlayerId: playerId}
	if err := ws.WriteJSON(initialMessage); err != nil {
		log.Printf("error: %v", err)
		return
	}

	// Main loop to listen for messages from the client
	for {
		_, msg, err := ws.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, client)
			availablePlayerIds = append(availablePlayerIds, playerId)
			break
		}

		var decodedMSG CodedMessage
		err = json.Unmarshal(msg, &decodedMSG)
		if err != nil {
			log.Println("Error decoding message:", err)
			return
		}

		switch decodedMSG.Code {
		case 1: // Code for setting player info (e.g., nickname)
			var playerInfo PlayerInfo
			err := json.Unmarshal([]byte(decodedMSG.Wsm), &playerInfo)
			if err != nil {
				log.Println("Error decoding player info:", err)
				return
			}
			client.nickname = playerInfo.Nickname
			log.Printf("Player %d set nickname to %s", client.playerId, client.nickname)

			// Broadcast updated player list to all clients
			allPlayers := getAllPlayerInfo()
			playerListMessage := struct {
				Code    int          `json:"code"`
				Players []PlayerInfo `json:"players"`
			}{Code: 2, Players: allPlayers}

			for c := range clients {
				err := c.conn.WriteJSON(playerListMessage)
				if err != nil {
					log.Printf("error: %v", err)
					c.conn.Close()
					delete(clients, c)
					availablePlayerIds = append(availablePlayerIds, c.playerId)
				}
			}

		case 3: // Code for player movement
			var position PlayerPosition
			err := json.Unmarshal([]byte(decodedMSG.Wsm), &position)
			if err != nil {
				log.Println("Error decoding position:", err)
				return
			}
			// Broadcast position to all clients
			for c := range clients {
				err := c.conn.WriteJSON(position)
				if err != nil {
					log.Printf("error: %v", err)
					c.conn.Close()
					delete(clients, c)
					availablePlayerIds = append(availablePlayerIds, c.playerId)
				}
			}

		case 4: // Code for bomb drop
			var bomb BombData
			err := json.Unmarshal([]byte(decodedMSG.Wsm), &bomb)
			if err != nil {
				log.Println("Error decoding bomb data:", err)
				return
			}
			// Broadcast bomb location to all clients
			for c := range clients {
				err := c.conn.WriteJSON(bomb)
				if err != nil {
					log.Printf("error: %v", err)
					c.conn.Close()
					delete(clients, c)
					availablePlayerIds = append(availablePlayerIds, c.playerId)
				}
			}

		case 5: // Code for bomb explosion
			var playerLives PlayerLives
			err := json.Unmarshal([]byte(decodedMSG.Wsm), &playerLives)
			if err != nil {
				log.Println("Error decoding explosion data:", err)
				return
			}
			// Broadcast explosion effect to all clients
			for c := range clients {
				err := c.conn.WriteJSON(playerLives)
				if err != nil {
					log.Printf("error: %v", err)
					c.conn.Close()
					delete(clients, c)
					availablePlayerIds = append(availablePlayerIds, c.playerId)
				}
			}

			case 6: // Code for bomb explosion
			var powerUpData PowerUpData
			err := json.Unmarshal([]byte(decodedMSG.Wsm), &powerUpData)
			if err != nil {
				log.Println("Error decoding explosion data:", err)
				return
			}
			// Broadcast explosion effect to all clients
			for c := range clients {
				err := c.conn.WriteJSON(powerUpData)
				if err != nil {
					log.Printf("error: %v", err)
					c.conn.Close()
					delete(clients, c)
					availablePlayerIds = append(availablePlayerIds, c.playerId)
				}
			}

		default:
			// Handle any other message types as needed
			broadcast <- Message{PlayerId: client.playerId, Text: string(msg)}
		}
	}
}