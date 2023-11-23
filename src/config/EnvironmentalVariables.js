import dotenv from "dotenv";

dotenv.config();

export const EnvironmentalVariables = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_SECRET_KEY: process.env.ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY: process.env.REFRESH_SECRET_KEY,
};
