import http from "http";
import "dotenv/config";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import userRoute from "./routes/user.routes.js";
import webRoute from "./routes/website.routes.js";
import cors from "cors";
import { Server } from "socket.io"; // Import Server from socket.io
import express from "express";

const prisma = new PrismaClient();
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

app.use(express.json());
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

const PORT = process.env.PORT;

// array to store and track the connected users by their unique ids respective to the socketId created
const activeSockets = {};

// get the active user utility function
export const getUserSocket = (userId) => {
  return activeSockets[userId];
};

// socket connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  console.log("Socket===>", socket.handshake.query);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") activeSockets[userId] = socket.id;

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

// Routes
app.use("/user", userRoute);
app.use("/v1/web", webRoute);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
});

// Export the io instance for use in other modules
export { io };
