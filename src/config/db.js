import mongoose from "mongoose";
import { EnvironmentalVariables } from "./EnvironmentalVariables.js";

const url = EnvironmentalVariables.MONGODB_URL;

export const connectMongoDb = () => {
  mongoose
    .connect(url)
    .then((e) => {
      console.log("Connected to MongoDB at: ", e.connection.host);
    })
    .catch((err) => {
      console.log("Mongo Db error: ", err);
    });
};
