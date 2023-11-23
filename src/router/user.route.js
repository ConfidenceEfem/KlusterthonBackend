import express from "express";
import {
  createANewToken,
  registerAUser,
  signInUser,
} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", registerAUser);
userRouter.post("/signin", signInUser);
userRouter.post("/refesh-token", createANewToken);

export default userRouter;
