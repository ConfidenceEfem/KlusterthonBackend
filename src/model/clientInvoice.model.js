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
      default: 0,
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
      required: true,
    },
    paymentAccessCode: {
      type: String,
    },
    paymentReferenceCode: {
      type: String,
    },

    purchasedDate: {
      type: Date,
      required: true,
    },
    productDescription: {
      type: String,
    },
    currency: {
      type: String,
      default: "NGN",
      required: true,
    },
    clientId: {
      ref: "clients",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const clientInvoiceModel = new mongoose.model("clientInvoice", clientInvoice);

export default clientInvoiceModel;
