import { walletModel } from "../model/user.wallet.model.js";
import request from "request";

import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";

const createUserWallet = async (userId) => {
  try {
    const findWallet = await walletModel.findOne({ userId });

    if (findWallet) {
      return findWallet;
    } else {
      const createWallet = await walletModel.create({ userId });
      return createWallet;
    }
  } catch (error) {
    console.log(error.message, "error while creating wallet");
  }
};

export const updatatingeWallet = async (userId, amount) => {
  try {
    const findWallet = await walletModel.findOne({ userId });

    if (!findWallet) {
      console.log("This user doesn't have a wallet");
    } else {
      const updateWallet = await walletModel.findByIdAndUpdate(
        userId,
        {
          $inc: {
            balance: amount,
          },
        },
        {
          new: true,
        }
      );

      return updateWallet;
    }
  } catch (error) {
    console.log("Error while updating wallet", error.message);
  }
};

export const verifyTransaction = async (req, res) => {
  try {
    const referenceId = req.params.referenceId;

    console.log("hello");

    const options = {
      url:
        "https://api.paystack.co/transaction/verify/" +
        encodeURIComponent(referenceId),
      headers: {
        Authorization: `Bearer ${EnvironmentalVariables.PAYSTACK_SECRET_KEY}`,
      },
    };

    request(options, async (error, body) => {
      if (error) {
        console.log("error verifying", error);
      } else {
        console.log("hello1");

        console.log(body);

        // let response = JSON.parse(body);
        console.log("hello2");

        // console.log(response?.data);

        res.status(201).json({ message: "data" });
      }
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error verifying transaction", error: error });
  }
};
