import dotenv from "dotenv";

dotenv.config();

export const EnvironmentalVariables = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  MAIL_USERNAME: process.env.MAIL_USERNAME,
  MAIL_PSWD: process.env.MAIL_PSWD
};
