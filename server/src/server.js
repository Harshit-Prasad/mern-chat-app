import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";

import { connectDB } from "./config/db.js";
import { router as userRoutes } from "./routes/user.route.js";
import { router as chatRoutes } from "./routes/chat.route.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, function () {
  console.log("Server Started on PORT: " + PORT);
});
