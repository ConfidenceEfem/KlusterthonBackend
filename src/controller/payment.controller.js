import { walletModel } from "../model/user.wallet.model.js";
import request from "request";

import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";
import userModel from "../model/user.model.js";
import { createTransaction } from "./transactions.controller.js";
import clientInvoiceModel from "../model/clientInvoice.model.js";
import { clientTransactionModel } from "../model/clientTransaction.model.js";
import got from "got";
import { walletTransactionModel } from "../model/walletTransaction.model.js";
import { withdrawalModel } from "../model/withdrawal.model.js";

const headers = {
  Authorization: `Bearer ${EnvironmentalVariables.PAYSTACK_SECRET_KEY} `,
  "Content-Type": "application/json",
};

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

const createWalletTransaction = async (
  type,
  amount,
  userId,
  oldBalance,
  newBalance
) => {
  try {
    const transaction = await walletTransactionModel.create({
      type,
      amount,
      userId,
      oldBalance,
      newBalance,
    });

    return transaction;
  } catch (error) {
    console.log("Error while creating wallet transaction", error.message);
  }
};

const withdrawalTransaction = async (
  accountNumber,
  accountName,
  bankCode,
  currency,
  amount,
  payerName,
  status,
  type,
  transfer_code,
  userId
) => {
  try {
    const transaction = await withdrawalModel.create({
      accountNumber,
      accountName,
      bankCode,
      currency,
      amount,
      payerName,
      status,
      type,
      transfer_code,
      userId,
    });

    return transaction;
  } catch (error) {
    console.log("Error while creating withdrawal transaction", error.message);
  }
};

export const verifyTransaction = async (req, res) => {
  try {
    const referenceId = req.params.referenceId;
    const invoiceId = req.params.invoiceId;

    // console.log(invoiceId);

    const findTransaction = await clientTransactionModel.findOne({
      transactionId: referenceId,
    });
    if (findTransaction) {
      console.log("Transaction already verified");
      res?.status(400).json({ message: "Transaction already verified" });
    } else {
      const findInvoice = await clientInvoiceModel
        .findById(invoiceId)
        .populate({ path: "clientId", populate: { path: "userId" } });

      // console.log("populated invoice data", findInvoice);

      const options = {
        url:
          "https://api.paystack.co/transaction/verify/" +
          encodeURIComponent(referenceId),
        headers: headers,
      };

      request(options, async (error, body) => {
        if (error) {
          console.log("error verifying", error);
        } else {
          let response = JSON.parse(body?.body);

          if (response?.status === false) {
            res.status(400).json({ message: response?.message });
          } else {
            const {
              amount,
              reference,
              status,
              id,
              gateway_response,
              customer,
              currency,
              metadata,
            } = response?.data;

            if (status !== "success") {
              console.log("transaction incomplete");
              res.status(400).json({ message: gateway_response });
            } else {
              const userWallet = await createUserWallet(metadata?.userId);

              const updatedWallet = await updatatingeWallet(
                metadata?.userId,
                amount / 100
              );

              await userModel.findByIdAndUpdate(
                metadata?.userId,
                {
                  $inc: { userWallet: amount / 100 },
                },
                { new: true }
              );

              await createTransaction(
                metadata?.invoiceId,
                metadata?.userId,
                metadata?.clientId,
                metadata?.clientName,
                metadata?.productName,
                customer?.email,
                amount / 100,
                currency,
                status
              );

              await createWalletTransaction(
                "credit",
                amount / 100,
                metadata?.userId,
                userWallet?.balance,
                updatedWallet?.balance
              );

              // console.log(response?.data);

              res.status(201).json({ message: "data", data: response?.data });
            }
          }
        }
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error verifying transaction", error: error.message });
  }
};

export const getBankCodes = async (req, res) => {
  try {
    const options = {
      url: "https://api.paystack.co/bank",
      headers: headers,
    };

    request(options, async (error, body) => {
      if (error) {
        res.status(400).json({ message: "error getting bank code", error });
      } else {
        const responseBody = JSON.parse(body.body);
        res.status(200).json({ message: "All bank", data: responseBody });
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error });
  }
};

// withdraw as a user
export const makeWithdrawal = async (req, res) => {
  try {
    const { accountName, accountNumber, bankCode, amount } = req.body;

    const findUser = await userModel.findById(req.user._id);

    const userWallet = await createUserWallet(req.user._id);

    if (findUser.userWallet < amount) {
      res.status(400).json({ message: "Insufficient balance" });
    } else {
      // create recipient

      const { data: recipientData } = await got
        .post("https://api.paystack.co/transferrecipient", {
          headers: headers,
          json: {
            type: "nuban",
            name: accountName,
            account_number: accountNumber,
            bank_code: bankCode,
          },
        })
        .json();

      // initialize transfer

      const initiateTransfer = await got
        .post("https://api.paystack.co/transfer", {
          headers: headers,
          json: {
            source: "balance",
            amount: amount * 100,
            recipient: recipientData?.recipient_code,
          },
        })
        .json();

      const { currency, transfer_code } = initiateTransfer.data;

      const updatedWallet = await updatatingeWallet(
        req.user._id,
        -(amount / 100)
      );

      await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { userWallet: -amount },
        },
        { new: true }
      );

      await createWalletTransaction(
        "debit",
        amount,
        findUser._id,
        userWallet?.balance,
        updatedWallet?.balance
      );

      await withdrawalTransaction(
        accountNumber,
        accountName,
        bankCode,
        currency,
        amount,
        findUser?.businessName,
        "pending",
        "nuban",
        transfer_code,
        findUser?._id
      );

      res.status(200).json({
        message: "transfer pending. You will recieve it in a an hour time",
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error making withdrawal", error: error.message });
  }
};

export const finalizeWithdrawal = async (req, res) => {
  try {
    const withdrawalId = req.params.withdrawalId;

    const { otp } = req.body;

    const findWithdrawalTransaction = await withdrawalModel?.findById(
      withdrawalId
    );

    const finalizeTransfer = await got
      .post(`https://api.paystack.co/transfer/finalize_transfer`, {
        headers: headers,
        json: {
          transfer_code: findWithdrawalTransaction?.transfer_code,
          otp: otp,
        },
      })
      .json();

    await withdrawalModel.findByIdAndUpdate(
      withdrawalId,
      { isPaymentCompleted: true, status: "successful" },
      { new: true }
    );

    res
      .status(201)
      .json({ message: "Transfer Successful", data: finalizeTransfer });
  } catch (error) {
    res.status(400).json({
      message: "Error while finalizing withdrawal",
      error: error.message,
    });
  }
};
