import mongoose, { model } from "mongoose";

const ClientTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients"
    },
    clientInvoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clientInvoice"
    },
    clientName: {
      type: String
      // required: true,
    },
    productName: {
      type: String
    },
    email: {
      required: true,
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed", "abandoned"]
    },
    paymentGateway: {
      type: String,
      required: true,
      default: "Paystack"
    },
    transactionId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export const clientTransactionModel = new model(
  "clientTransaction",
  ClientTransactionSchema
);
