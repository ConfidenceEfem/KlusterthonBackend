import express from "express";
import userRouter from "../router/user.route.js";
import clientRouter from "../router/client.route.js";
import clientInvoiceRouter from "../router/clientInvoice.route.js";
import clientTransactionRouter from "../router/clientTransaction.route.js";
import paymentRouter from "../router/payment.route.js";
import withDrawRouter from "../router/withdraw.route.js";

const router = express.Router();

router.use("/", userRouter);
router.use("/client", clientRouter);
router.use("/invoice", clientInvoiceRouter);
router.use("/transaction", clientTransactionRouter);
router.use("/payment", paymentRouter);
router.use("/withdraw", withDrawRouter);

export default router;
