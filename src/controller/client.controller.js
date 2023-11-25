import express from "express";
import clientModel from "../model/client.model.js";
import userModel from "../model/user.model.js";
import mongoose from "mongoose";

export const createNewClient = async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;

    const userId = req.user._id;

    const findUser = await userModel.findById(userId);

    const newClient = new clientModel({
      email,
      fullName,
      phoneNumber,
    });

    newClient.userId = findUser;

    newClient.save();

    findUser?.clients.push(new mongoose.Types.ObjectId(newClient._id));

    findUser.save();

    res.status(201).json({ message: "new client", data: newClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getAllClient = async (req, res) => {
  try {
    const allClient = await clientModel.find();

    res.status(201).json({ message: "All Client", data: allClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getAllClientForOneUser = async (req, res) => {
  try {
    const allClient = await clientModel.find({ userId: req.user._id });

    res
      .status(201)
      .json({ message: "All Client for one User", data: allClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getOneClient = async (req, res) => {
  try {
    const findClient = await clientModel.findById(req.params.clientId);

    res.status(201).json({ message: "One Client", data: findClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const deleteClientData = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    const deleteClient = await clientModel.findByIdAndDelete(clientId);

    const findClientUser = await userModel.findById(deleteClient.userId);

    await findClientUser?.clients?.pull(
      new mongoose.Types.ObjectId(deleteClient._id)
    );

    findClientUser.save();

    res
      .status(201)
      .json({ message: "Client Deleted Successfully", data: deleteClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};
