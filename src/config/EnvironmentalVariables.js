import dotenv from "dotenv";

dotenv.config();

export const EnvironmentalVariables = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  API_KEY: process.env.API_KEY,
  REDIRECT_URL: process.env.REDIRECT_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
};
