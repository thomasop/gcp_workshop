import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

let app = express();
export const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let users: any = {};
io.on("connection", (socket) => {
  console.log("user connection");
  socket.on("send-msg", (data) => {
    socket.broadcast.emit("get-msg", data.result);
  });
  socket.on("send-edit-new-msg", (data) => {
    socket.broadcast.emit("get-edit-new-msg", data.result);
  });
  socket.on("send-log", function (data) {
    users[socket.id] = data.userId;
  });
  socket.on("del-log", function (data) {
    delete users[socket.id];
  });
  socket.broadcast.emit("get-log", users);
  socket.on("send-conv", (data) => {
    socket.broadcast.emit("get-conv", data.result);
  });
  socket.on("send-writing", (data) => {
    socket.broadcast.emit('get-writing', data)
  })
  socket.on("disconnect", () => {
    console.log("user disconnect");
  });
});

export default app;