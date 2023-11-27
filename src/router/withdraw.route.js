import { Router } from "express";
import {
  disableOtp,
  finalizeDisableOtp,
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
withDrawRouter.post("/disable-otp", disableOtp);
withDrawRouter.post("/disable-otp/finalize", finalizeDisableOtp);
withDrawRouter.get("/current-user", checkUser, getCurrentUserWithdrawal);

export default withDrawRouter;
