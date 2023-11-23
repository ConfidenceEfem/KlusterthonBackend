import mongoose from "mongoose";

const clientInvoice = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentLink: {
      type: String,
    },
    paymentAccountNumber: {
      type: String,
    },
    ussdPaymentCode: {
      type: Number,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    productDescription: {
      type: String,
    },
    clientId: {
      ref: "clients",
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const clientInvoiceModel = new mongoose.model("clientInvoice", clientInvoice);

export default clientInvoiceModel;
