import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://kanban-board-two-lac.vercel.app',
  credentials: true
}));
app.options('*', cors({
  origin: 'https://kanban-board-two-lac.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;

connectDB();

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

const server  = http.createServer(app);

const io = new Server(server, {
  cors: {
        origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

export { io };

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});