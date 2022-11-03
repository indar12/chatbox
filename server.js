const express = require("express");
const app = express();

const server = require("http").createServer(app);
const path = require("path");
app.use(express.static(path.join(__dirname, "/")));

const socketio = require("socket.io");
const io = socketio(server);
// to store the username
let user = [];
//run when client connects
io.on("connection", (socket) => {
  // listen when new user joins
  socket.on("newuser", (username) => {
    user[socket.id] = username;
    // sends to all other users otherthan sender
    socket.broadcast.emit("newuser", username);
  });
  // listen when chat is send
  socket.on("chat", (data) => {
    socket.broadcast.emit("chatgroup", data);
    socket.emit("chat", data);
  });
  // listen while typing a message
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  // runs when client disconnect
  socket.on("disconnect", () => {
    socket.broadcast.emit("exit", user[socket.id]);
  });
});

server.listen(5000, () => console.log("server running..."));
