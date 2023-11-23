import { Router } from "express";
import {
  createNewClient,
  deleteClientData,
  getAllClientForOneUser,
} from "../controller/client.controller.js";
import { checkUser } from "../utils/checkUser.js";

const clientRouter = Router();

clientRouter.post("/add", checkUser, createNewClient);
clientRouter.get("/client", checkUser, getAllClientForOneUser);
clientRouter.delete("/remove", checkUser, deleteClientData);

export default clientRouter;
