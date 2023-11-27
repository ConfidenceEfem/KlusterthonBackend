import { Router } from "express";
import {
  createNewClient,
  deleteClientData,
  getAllClient,
  getAllClientForOneUser,
  getOneClient
} from "../controller/client.controller.js";
import { checkUser } from "../utils/checkUser.js";

const clientRouter = Router();

clientRouter.post("/add", checkUser, createNewClient);
clientRouter.post("/oneUser", checkUser, getAllClientForOneUser);
clientRouter.get("/", checkUser, getAllClient);
clientRouter.get("/:clientId", checkUser, getOneClient);
clientRouter.delete("/:clientId/remove", checkUser, deleteClientData);

export default clientRouter;
