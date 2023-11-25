import { Router } from "express";
import {
  getBankCodes,
  makeWithdrawal,
  verifyTransaction,
  finalizeWithdrawal,
} from "../controller/payment.controller.js";
import { checkUser } from "../utils/checkUser.js";

const paymentRouter = Router();

paymentRouter.get("/verify/:referenceId/:invoiceId", verifyTransaction);
paymentRouter.get("/bankcode", getBankCodes);
paymentRouter.post("/withdrawal", checkUser, makeWithdrawal);
paymentRouter.post(
  "/withdrawal/finalize/:withdrawalId",
  checkUser,
  finalizeWithdrawal
);

export default paymentRouter;
