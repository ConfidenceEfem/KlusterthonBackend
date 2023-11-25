import { Router } from "express";
import {
  getAllTransactionsForOneUser,
  getOneTransaction,
} from "../controller/transactions.controller.js";
import { getAllInvoiceForOneClient } from "../controller/clientInvoice.controller.js";
import { checkUser } from "../utils/checkUser.js";

const clientTransactionRouter = Router();

clientTransactionRouter.get(
  "/user/:userId",
  checkUser,
  getAllTransactionsForOneUser
);
clientTransactionRouter.get(
  "/client/:clientId",
  checkUser,
  getAllInvoiceForOneClient
);
clientTransactionRouter.get("/:transactionId", checkUser, getOneTransaction);

export default clientTransactionRouter;
