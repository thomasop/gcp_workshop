import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { verify } = Jwt;
    const decodeToken: any = verify(token, process.env.SECRET_TOKEN as string);
    req.auth = { user: decodeToken.user };
    next();
  } catch (error) {
    res.status(401).json({ status: 400, errors: error });
  }
};
