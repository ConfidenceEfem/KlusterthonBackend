import { withdrawalModel } from "../model/withdrawal.model.js";

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
export const getOneWithdraw = async (req, res) => {
  try {
    const withdrawId = req.params.withdrawId;

    const oneWithdraw = await withdrawalModel.findById(withdrawId);

    res.status(201).json({ message: "One Withdraw", data: oneWithdraw });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
