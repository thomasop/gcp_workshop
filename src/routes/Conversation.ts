import express, { Request, Response } from "express";
import auth from "../middleware/auth.js";
import { Add, All } from "../controllers/Conversation.js";
import { body } from "express-validator";

const conversationRouter = express.Router();

conversationRouter.post(
  "/add",
  auth,
  body("content")
    .notEmpty()
    .escape()
    .withMessage("Le contenu du message ne doit pas être vide"),
  Add
);
conversationRouter.get("/all/:id", auth, All);

export default conversationRouter;
