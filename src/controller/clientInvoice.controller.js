import mongoose from "mongoose";
import clientModel from "../model/client.model.js";
import clientInvoiceModel from "../model/clientInvoice.model.js";
import got from "got";
import paystack from "paystack";
import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";

// const initailizePayment = async (
//   amount,
//   currency,
//   invoiceId,
//   clientId,
//   clientEmail,
//   clientPhoneNumber,
//   clientName,
//   productName,
//   description
// ) => {
//   const randowTxRef = Date.now().toString();
//   const response = await got
//     .post("https://api.flutterwave.com/v3/payments", {
//       headers: {
//         Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//       },
//       json: {
//         tx_ref: randowTxRef,
//         amount: amount,
//         currency: currency,
//         redirect_url:
//           "https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
//         meta: {
//           invoiceId: invoiceId,
//           clientId: clientId,
//         },
//         customer: {
//           email: clientEmail,
//           phonenumber: clientPhoneNumber,
//           name: clientName,
//         },
//         customizations: {
//           title: `Payment of ${productName}`,
//           description: description,
//         },
//       },
//     })
//     .json();

//   console.log(response?.data);

//   return response?.data;
// };

const initailizePayment = async (
  amount,
  currency,
  invoiceId,
  clientId,
  clientEmail,
  clientPhoneNumber,
  clientName,
  productName,
  description
) => {
  const randowTxRef = Date.now().toString();
  const response = await got
    .post("https://api.paystack.co/transaction/initialize", {
      headers: {
        Authorization: `Bearer ${EnvironmentalVariables.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      json: {
        amount: amount * 100,
        email: clientEmail,
        currency: currency,
        // callback_url:"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
        meta: {
          invoiceId: invoiceId,
          clientId: clientId,
        },
      },
    })
    .json();

  return response?.data;
};

export const createClientInvoice = async (req, res) => {
  try {
    const {
      productName,
      amount,
      discount,
      total,
      purchasedDate,
      productDescription,
      currency,
    } = req.body;

    const findClient = await clientModel.findById(req.params.clientId);

    const createInvoice = new clientInvoiceModel({
      productName,
      amount,
      discount,
      total,
      purchasedDate,
      productDescription,
      currency,
    });

    createInvoice.clientId = findClient;

    let makePayment = await initailizePayment(
      total,
      currency,
      createInvoice._id,
      findClient?._id,
      findClient?.email,
      findClient?.phoneNumber,
      findClient.fullName,
      productName,
      productDescription
    );

    createInvoice.paymentLink = makePayment?.authorization_url;
    createInvoice.paymentAccessCode = makePayment?.access_code;
    createInvoice.paymentReferenceCode = makePayment?.reference;

    createInvoice.save();

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
      .findById(req.params.clientId)
      .populate("clientInvioce");

    res.status(200).json({ message: "Client All Invoice", data: getClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getOneInvoice = async (req, res) => {
  try {
    const getInvoice = await clientInvoiceModel.findById(req.params.invoiceId);

    res.status(200).json({ message: "One Invoice", data: getInvoice });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const editClientInvoice = async (req, res) => {
  try {
    const { productName, isPaid } = req.body;

    const getInvoice = await clientInvoiceModel.findByIdAndUpdate(
      req.params.invoiceId,
      {
        productName,
        isPaid,
      },
      { new: true }
    );

    res.status(201).json({ message: "Invoice updated", data: getInvoice });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const deleteClientInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;

    const deleteInvoice = await clientInvoiceModel.findByIdAndDelete(invoiceId);

    res.status(200).json({ message: "Invoice deleted", data: deleteInvoice });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};
