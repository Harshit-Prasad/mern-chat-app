import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log(socket.id);
});

server.listen(PORT, () => {
  console.log("server running at http://localhost:" + PORT);
});
