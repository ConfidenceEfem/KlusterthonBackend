import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "You're required to input email"]
    },

    fullName: {
      type: String
    },
    phoneNumber: {
      type: String
    },

    userId: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId
    },

    clientInvoice: [
      {
        ref: "clientInvoice",
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    clientTransactionHistory: [
      {
        ref: "clientTransaction",
        type: mongoose.Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true
  }
);

const clientModel = new mongoose.model("clients", clientSchema);

export default clientModel;
