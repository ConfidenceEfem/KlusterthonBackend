import express from "express";
import {
  createANewToken,
  registerAUser,
  resendOtp,
  signInUser,
  verifyEmail,
} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", registerAUser);
userRouter.post("/signin", signInUser);
userRouter.post("/refresh-token", createANewToken);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-otp", resendOtp);

export default userRouter;
