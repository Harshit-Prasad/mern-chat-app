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
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, function () {
  console.log("Server Started on PORT: " + PORT);
});

// Socket.io
io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
    socket.in(room).emit("remote-user-joined", { from: socket.id });
  });

  // Real time typing indicator
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop-typing", (room) => {
    socket.in(room).emit("stop-typing");
  });

  // Real time messaging
  socket.on("new-message", (message) => {
    let chat = message.chat;

    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.in(user._id).emit("message-recieved", message);
    });
  });

  // Video Calling
  socket.on("local-user-joined", ({ to }) => {
    io.to(to).emit("local-user-joined", { from: socket.id });
  });

  socket.on("call-remote-user", ({ to, offer }) => {
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });

  socket.on("call-accepted", ({ answer, to }) => {
    io.to(to).emit("call-accepted", { from: socket.id, answer });
  });

  socket.on("call-rejected", ({ to }) => {
    io.to(to).emit("call-rejected");
  });

  socket.on("nego-needed", ({ offer, to }) => {
    io.to(to).emit("nego-incoming", { from: socket.id, offer });
  });

  socket.on("nego-done", ({ answer, to }) => {
    io.to(to).emit("nego-final", { from: to, answer });
  });

  socket.on("end-call", ({ to }) => {
    io.to(to).emit("call-ended");
  });
});
