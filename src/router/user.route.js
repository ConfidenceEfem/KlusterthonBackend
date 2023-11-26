import express from "express";
import {
  createANewToken,
  getCurrentUser,
  registerAUser,
  resendOtp,
  signInUser,
  verifyEmail,
} from "../controller/user.controller.js";
import { checkUser } from "../utils/checkUser.js";

const userRouter = express.Router();

userRouter.post("/signup", registerAUser);
userRouter.post("/signin", signInUser);
userRouter.post("/refresh-token", createANewToken);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-otp", resendOtp);
userRouter.get("/me", checkUser, getCurrentUser);

export default userRouter;
