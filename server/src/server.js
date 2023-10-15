import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import messageRoutes from "./routes/message.route.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config();
connectDB();
const PORT = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

// Routes

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, function () {
  console.log("Server Started on PORT: " + PORT);
});
