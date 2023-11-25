import clientModel from "../model/client.model.js";
import { clientTransactionModel } from "../model/clientTransaction.model.js";

export const getAllTransactionsForOneUser = async (req, res) => {
  try {
    const allTransactions = await clientTransactionModel.find({
      userId: req.params.userId,
    });

    res
      .status(200)
      .json({ message: "All Transactions", data: allTransactions });
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: error.message,
    });
  }
};

export const getAllTransactionsForOneClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    const allTransactions = await clientModel
      .findById(clientId)
      .populate("clientTransactionHistory");

    res
      .status(200)
      .json({ message: "All Transactions", data: allTransactions });
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: error.message,
    });
  }
};

export const getOneTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;

    const allTransactions = await clientTransactionModel.findById(
      transactionId
    );
    res
      .status(200)
      .json({ message: "One Transactions", data: allTransactions });
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: error.message,
    });
  }
};

export const getAllTransaction = async (req, res) => {
  try {
    const allTransactions = await clientTransactionModel.find();
    res
      .status(200)
      .json({ message: "All Transactions", data: allTransactions });
  } catch (error) {
    res.status(400).json({
      message: "error",
      error: error.message,
    });
  }
};

export const createTransaction = async (
  clientInvoiceId,
  userId,
  clientId,
  clientName,
  productName,
  email,
  amount,
  currency,
  paymentStatus,
  paymentGateway,
  transactionId
) => {
  try {
    const transaction = await clientTransactionModel.create({
      userId: userId,
      clientId,
      clientInvoiceId,
      clientName,
      productName,
      email,
      amount,
      currency,
      paymentStatus,
      paymentGateway,
      transactionId,
    });

    return transaction;
  } catch (error) {
    console.log("error while creating transaction", error);
  }
};
