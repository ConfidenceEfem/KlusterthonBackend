import express from "express";
import { AppConfig } from "./server.js";
import { EnvironmentalVariables } from "./src/config/EnvironmentalVariables.js";
import { connectMongoDb } from "./src/config/db.js";

const port = EnvironmentalVariables.PORT;

const app = express();

AppConfig(app);

connectMongoDb();

app.listen(port, () => {
  console.log("Listening to port", port);
});
