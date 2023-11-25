import { Router } from "express";
import { verifyTransaction } from "../controller/payment.controller.js";

const paymentRouter = Router();

paymentRouter.get("/verify/:referenceId", verifyTransaction);

export default paymentRouter;
