import { Schema, model } from "mongoose";

const walletTransactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["debit", "credit"],
    },
    amount: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    oldBalance: {
      type: Number,
    },
    newBalance: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const walletTransactionModel = new model(
  "walletTransaction",
  walletTransactionSchema
);
