import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  otp: { string, required: true },
  email: { string, required: true },
  verificationKey: { string, required: true },
  createdAt: { type: Date, default: Date.now(), index: { expires: 5000 } },
});

const otpModel = new model("otp", otpSchema);
