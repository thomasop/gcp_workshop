import express, { Request, Response } from "express";
import auth from "../middleware/auth.js";
import { All, Login, Logout } from "../controllers/User.js";
import { body } from "express-validator";

const userRouter = express.Router();

userRouter.post(
  "/login",
  body("email")
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage("Email : need to be have this format 'mail@mail.com'"),
  body("password")
    .notEmpty()
    .escape()
    .isLength({ min: 4 })
    .withMessage("Password : min length need to be 4"),
  Login
);
userRouter.get("/all", auth, All);
userRouter.post("/logout", auth, Logout);

export default userRouter;
