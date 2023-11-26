import { Router } from "express";
import {
  getAllWithdrawal,
  getAllWithdrawalForOneUser,
  getOneWithdraw,
} from "../controller/withdrawal.controller.js";

const withDrawRouter = Router();

withDrawRouter.get("/", getAllWithdrawal);
withDrawRouter.get("/user/:userId", getAllWithdrawalForOneUser);
withDrawRouter.get("/:withdrawId", getOneWithdraw);

export default withDrawRouter;
