import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  otp: { type: String, required: true },
  email: { type: String, required: true },
  verificationKey: { type: String, required: true },
  createdAt: { type: Date, default: Date.now(), index: { expires: 5000 } },
});

export const otpModel = new model("otp", otpSchema);
