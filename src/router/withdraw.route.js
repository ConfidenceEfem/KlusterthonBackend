import { Router } from "express";
import {
  getAllWithdrawal,
  getAllWithdrawalForOneUser,
  getCurrentUserWithdrawal,
  getOneWithdraw,
} from "../controller/withdrawal.controller.js";
import { checkUser } from "../utils/checkUser.js";

const withDrawRouter = Router();

withDrawRouter.get("/", getAllWithdrawal);
withDrawRouter.get("/user/:userId", getAllWithdrawalForOneUser);
withDrawRouter.get("/:withdrawId", getOneWithdraw);
withDrawRouter.get("/current-user", checkUser, getCurrentUserWithdrawal);

export default withDrawRouter;
