import mongoose from "mongoose";
import clientModel from "../model/client.model";
import clientInvoiceModel from "../model/clientInvoice.model.js";

export const createClientInvoice = async (req, res) => {
  try {
    const {
      productName,
      amount,
      discount,
      total,
      paymentLink,
      paymentAccountNumber,
      ussdPaymentCode,
      purchasedDate,
      productDescription,
      paymentBankName,
      currency,
    } = req.body;

    const findClient = await clientModel.findById(req.params.id);

    const createInvoice = new clientInvoiceModel({
      productName,
      amount,
      discount,
      total,
      paymentLink,
      paymentAccountNumber,
      ussdPaymentCode,
      purchasedDate,
      productDescription,
      paymentBankName,
    });

    createInvoice.clientId = findClient;

    await createInvoice.save();

    findClient.clientInvioce.push(
      new mongoose.Types.ObjectId(createInvoice._id)
    );

    findClient.save();

    res.status(201).json({ message: "Invioce Created", data: createInvoice });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getAllInvoiceForOneClient = async (req, res) => {
  try {
    const getClient = await clientModel
      .findById(req.params.id)
      .populate("clientInvioce");

    res.status(200).json({ message: "Client All Invoice", data: getClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const editClientInvoice = async () => {
  try {
    const { productName, amount, discount, total, isPaid } = req.body;

    const getInvoice = await clientInvoiceModel.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        amount,
        discount,
        total,
        isPaid,
      },
      { new: true }
    );

    res.status(201).json({ message: "Invoice updated", data: getInvoice });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};
