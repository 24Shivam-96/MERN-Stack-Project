import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.route.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5173",
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Make io accessible in routes
app.set("io", io);

// Health check endpoint for deployment platforms
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
  if (process.env.NODE_ENV === "production") {
    console.log("Running in production mode");
  }
});
