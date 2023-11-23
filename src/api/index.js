import express from "express";
import userRouter from "../router/user.route.js";

const router = express.Router();

router.use("/", userRouter);

export default router;
