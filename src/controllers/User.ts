import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const generateAccessToken = (user: string) => {
  return jwt.sign({ mail: user }, process.env.SECRET_TOKEN as string);
};

const Login = async (req: Request, res: Response) => {
  let error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }
  let email = req.body.email;
  const user = await User.findOne({ where: { mail: email } });
  if (user === null) {
    res.status(400).json({ errors: "Mauvaise combinaison email/password" });
  } else {
    const compare = async () => {
      const comp = await bcrypt.compare(
        req.body.password,
        user?.dataValues.password
      );
      if (comp == false) {
        return res
          .status(400)
          .json({ errors: "Mauvaise combinaison email/password" });
      } else {
        const updateUser = await User.update(
          { status: true },
          {
            where: {
              id: user.dataValues.id,
            },
          }
        );
        const accessToken: any = generateAccessToken(req.body.email);
        const userLogin = {
          id: user.dataValues.id,
          firstname: user.dataValues.firstname,
          lastname: user.dataValues.lastname,
          mail: user.dataValues.mail,
        };
        var expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        res.cookie("userId", user.dataValues.id, {
          expires: expiryDate,
          secure: false,
          httpOnly: false,
          path: "/",
        });
        res.cookie("token", accessToken, {
          expires: expiryDate,
          secure: false,
          httpOnly: false,
          path: "/",
        });
        return res.status(200).json({
          user: userLogin,
          accessToken: accessToken,
        });
      }
    };
    compare();
  }
};

const All = async (req: Request, res: Response) => {
  const AllUsers = await User.findAll({});
  if (AllUsers == null) {
    return res.status(400).json({ error: "No user find" });
  } else {
    res.status(200).json({ results: AllUsers });
  }
};

const Logout = async (req: Request, res: Response) => {
  let userId = req.body.userId;
  const updateUser = await User.update(
    { status: false },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("userId", {
    maxAge: 0,
    secure: false,
    httpOnly: false,
    path: "/",
    expires: new Date(0),
  });
  res.clearCookie("token", {
    maxAge: 0,
    secure: false,
    httpOnly: false,
    path: "/",
    expires: new Date(0),
  });
  res.json({ result: "test" });
};

export { Login, All, Logout };
