import express from "express";
import cors from "cors";
import router from "./src/api/index.js";

export const AppConfig = (app) => {
  app
    .use(express.json())

    .use(cors())

    .get("/", (req, res) => {
      res.send("Welcome to Klustherton Backend");
    })

    .use("/", router)

    .all("*", (req, res) => {
      res
        .status(404)
        .json({ message: "This route is not found", data: req.originalUrl });
    });
};
