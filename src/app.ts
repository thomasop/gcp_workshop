import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import conversationRouter from "./routes/Conversation.js";
import messageRouter from "./routes/Message.js";
import userRouter from "./routes/User.js";
dotenv.config();

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser(process.env.SECRET_COOKIE));

app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

export default app;
