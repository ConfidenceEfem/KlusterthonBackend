import express from "express";
import {
  createClientInvoice,
  deleteClientInvoice,
  editClientInvoice,
  getAllInvoiceForOneClient,
  getOneInvoice,
} from "../controller/clientInvoice.controller.js";
import { checkUser } from "../utils/checkUser.js";

const clientInvoiceRouter = express.Router();

clientInvoiceRouter.post("/create/:clientId", checkUser, createClientInvoice);
clientInvoiceRouter.get(
  "/client/:clientId",
  checkUser,
  getAllInvoiceForOneClient
);
clientInvoiceRouter.get("/:invoiceId", checkUser, getOneInvoice);
clientInvoiceRouter.patch("/:invoiceId", checkUser, editClientInvoice);
clientInvoiceRouter.delete("/:invoiceId", checkUser, deleteClientInvoice);

export default clientInvoiceRouter;
