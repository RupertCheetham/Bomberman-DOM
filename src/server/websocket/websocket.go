package websocket

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
// 	conn *websocket.Conn
// }

// var clients = make(map[*Client]bool)
// var broadcast = make(chan string)

// // Handle incoming WebSocket connections
// func HandleConnections(w http.ResponseWriter, r *http.Request) {
// 	// Upgrade initial GET request to a WebSocket
// 	ws, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer ws.Close()

// 	// Register the new client
// 	client := &Client{conn: ws}
// 	clients[client] = true

// 	// Listen for messages
// 	for {
// 		_, msg, err := ws.ReadMessage()
// 		if err != nil {
// 			log.Printf("error: %v", err)
// 			delete(clients, client)
// 			break
// 		}
// 		// Send the received message to the broadcast channel
// 		broadcast <- string(msg)
// 	}
// }

// // Handle broadcasting messages to all clients
// func HandleMessages() {
// 	for {
// 		// Grab the next message from the broadcast channel
// 		msg := <-broadcast
// 		// Send the message to every client connected
// 		for client := range clients {
// 			err := client.conn.WriteMessage(websocket.TextMessage, []byte(msg))
// 			if err != nil {
// 				log.Printf("error: %v", err)
// 				client.conn.Close()
// 				delete(clients, client)
// 			}
// 		}
// 	}
// }
