import { io } from "socket.io-client"

let socket = null

export const connectSocket = (token) => {
  if (socket) {
    socket.disconnect()
  }

  socket = io("http://localhost:5000", {
    auth: {
      token: token,
    },
    transports: ["websocket"],
  })

  socket.on("connect", () => {
    console.log("Connected to WebSocket server")
  })

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server")
  })

  socket.on("connect_error", (error) => {
    console.error("WebSocket connection error:", error)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => {
  return socket
}
