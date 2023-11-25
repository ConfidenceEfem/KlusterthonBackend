import { Router } from "express";
import {
  getAllTransaction,
  getAllTransactionsForOneClient,
  getAllTransactionsForOneUser,
  getOneTransaction,
} from "../controller/transactions.controller.js";
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
  getAllTransactionsForOneClient
);
clientTransactionRouter.get("/:transactionId", checkUser, getOneTransaction);
clientTransactionRouter.get("/", checkUser, getAllTransaction);

export default clientTransactionRouter;
