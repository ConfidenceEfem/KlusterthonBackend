import mongoose, { Schema, model } from "mongoose";

const withdrawalSchema = new Schema(
  {
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    payerName: {
      type: String,
      required: true,
    },
    paymentGateway: {
      type: String,
      default: "Paystack",
    },
    status: {
      type: String,
      enum: ["successful", "pending", "failed"],
    },
    isPaymentCompleted: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "nuban",
    },
    transfer_code: {
      type: String,
    },
    recipient_code: {
      type: String,
    },
    reference: {
      type: String,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const withdrawalModel = new model("withdrawal", withdrawalSchema);
