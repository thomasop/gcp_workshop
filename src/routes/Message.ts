import express, { Request, Response } from "express";
import auth from "../middleware/auth.js";
import { body } from "express-validator";
import { All, Add, Edit } from "../controllers/Message.js";

const messageRouter = express.Router();

messageRouter.get("/all/:id", auth, All);
messageRouter.post("/add", auth, body("content").notEmpty().escape(), Add);
messageRouter.get("/edit/:conversationId/:otherIdUser", Edit);

export default messageRouter;
