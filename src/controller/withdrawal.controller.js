import { withdrawalModel } from "../model/withdrawal.model.js";
import got from "got";
import { headers } from "./payment.controller.js";

// all withdrawas
export const getAllWithdrawal = async (req, res) => {
  try {
    const allWithdraw = await withdrawalModel.find();

    res.status(201).json({ message: "All withdraws", data: allWithdraw });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

// all with withdraws for a specific user
export const getAllWithdrawalForOneUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const allWithdraw = await withdrawalModel.find({ userId: userId });

    res
      .status(201)
      .json({ message: "All withdraws for One User", data: allWithdraw });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
// all with withdraws for a specific user
export const getCurrentUserWithdrawal = async (req, res) => {
  try {
    const userId = req.user._id;

    const allWithdraw = await withdrawalModel.find({ userId: userId });

    res
      .status(201)
      .json({ message: "All withdraws for One User", data: allWithdraw });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

// all with withdraws for a specific user
export const getOneWithdraw = async (req, res) => {
  try {
    const withdrawId = req.params.withdrawId;

    const oneWithdraw = await withdrawalModel.findById(withdrawId);

    res.status(201).json({ message: "One Withdraw", data: oneWithdraw });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

// disable otp from paystack
export const disableOtp = async (req, res) => {
  try {
    const response = await got
      .post(`https://api.paystack.co/transfer/disable_otp`, {
        headers: headers,
      })
      .json();

    console.log("otp sent", response);

    res.status(201).json({ message: "Disable pending", response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// finalize disable otp from paystack
export const finalizeDisableOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const response = await got
      .post(`https://api.paystack.co/transfer/disable_otp_finalize`, {
        headers: headers,
        json: {
          otp: otp,
        },
      })
      .json();

    console.log("otp disabled", response);

    res.status(201).json({ message: "Disable", response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// finalize disable otp from paystack
export const approveTransfer = async (req, res) => {
  try {
    const { body } = req;

    console.log(body);

    res.status(200).json({ message: "Disable", data: body });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
