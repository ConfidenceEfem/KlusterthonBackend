import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "You're required to input email"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "You're required to input password"]
    },
    businessName: {
      type: String
    },

    isEmailVerified: {
      type: Boolean,
      default: false
    },

    clients: [
      {
        ref: "clients",
        type: mongoose.Schema.Types.ObjectId
      }
    ],
    userWallet: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const userModel = new mongoose.model("user", UserSchema);

export default userModel;
