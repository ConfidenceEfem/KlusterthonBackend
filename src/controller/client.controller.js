import express from "express";
import clientModel from "../model/client.model";

export const createNewClient = async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;

    const createClient = await clientModel.create({
      email,
      fullName,
      phoneNumber,
    });

    if (!createClient) {
      res.status(400).json({ message: "Failed in creating a client" });
    } else {
      res
        .status(201)
        .json({ message: "Client created succesfully", data: createClient });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const getAllClientForOneUser = async (req, res) => {
  try {
    const allClient = await clientModel.find({ email: req.user.email });

    res.status(201).json({ message: "All Client", data: allClient });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};
