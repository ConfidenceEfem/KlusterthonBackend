import express from "express";
import userRouter from "../router/user.route.js";
import clientRouter from "../router/client.route.js";

const router = express.Router();

router.use("/", userRouter);
router.use("/client", clientRouter);

export default router;
