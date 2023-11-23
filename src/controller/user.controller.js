import express from "express";
import bcrypt from "bcrypt";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";
import otpGenerator from "otp-generator";

const bcyrptPassword = (password) => {
  const saltPassword = bcrypt.genSalt(10);
  const hashPassword = bcrypt.hash(password, saltPassword);

  return hashPassword;
};

const generateOtpMethod = (
  numberOfChar,
  isLowercaseAlphabet,
  isUppercaseAlphabet
) => {
  const generateOtp = otpGenerator.generate(numberOfChar, {
    lowerCaseAlphabets: isLowercaseAlphabet,
    upperCaseAlphabets: isUppercaseAlphabet,
    specialChars: false,
    digits: true,
  });

  return generateOtp;
};

export const registerAUser = async (req, res) => {
  try {
    const { email, password, businessName } = req.body;

    const hashPassword = bcyrptPassword(password);

    const createUser = await userModel.create({
      email,
      password: hashPassword,
      businessName,
    });

    if (createUser) {
      const generatedOtp = generateOtpMethod(6, false, false);

      const hashOtp = bcyrptPassword(generatedOtp);

      const verificationKey = generateOtpMethod(30, true, true);

      await otpModel.create({
        otp: hashOtp,
        verificationKey,
        email: email,
      });

      console.log("generated otp", generatedOtp);

      // send otp through email smtp

      res
        ?.status(200)
        .json({ message: "User Created Successfully", data: createUser });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", data: error });
  }
};

export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      res.status(400).json({ message: "Incorrect Credentail" });
    } else {
      const comparePassword = await bcrypt.compare(
        password,
        findUser?.password
      );
      if (comparePassword) {
        res.status(400).json({ message: "Incorrect Credentail" });
      } else {
        const accesstoken = jwt.sign(
          {
            _id: findUser?._id,
            email: findUser?.email,
            userWallet: findUser?.userWallet,
            businessName: findUser?.businessName,
            isFirstTimeLogginin: findUser?.isFirstTimeLogginin,
            createdAt: findUser?.createdAt,
          },
          EnvironmentalVariables.ACCESS_SECRET_KEY,
          { expiresIn: "600s" }
        );

        const refreshToken = jwt.sign(
          {
            _id: findUser?._id,
            email: findUser?.email,
          },
          EnvironmentalVariables.REFRESH_SECRET_KEY,
          { expiresIn: "2d" }
        );

        const userData = {
          data: findUser,
          token: { accesstoken: accesstoken, refreshToken: refreshToken },
        };

        res
          ?.status(200)
          .json({ message: "User logged in successfully", data: userData });
      }
    }
  } catch (error) {
    res.status(404).json({ message: "Error", error: error });
  }
};

export const createANewToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const verifyToken = jwt.verify(
      refreshToken,
      EnvironmentalVariables.REFRESH_SECRET_KEY,
      (err, payload) => {
        if (err) {
          res.status(400).json({ message: "Invalid token", error: err });
        }
      }
    );

    if (!verifyToken) {
      res?.status(400).json({ message: "Incorrect Token" });
    } else {
      const decodeToken = jwt.decode(refreshToken);
      console.log(decodeToken);

      const findUser = await userModel.findOne({ email: decodeToken?.email });
      if (!findUser) {
        res.status(404).json({ message: "User not found" });
      } else {
        const accesstoken = jwt.sign(
          {
            _id: findUser?._id,
            email: findUser?.email,
            userWallet: findUser?.userWallet,
            businessName: findUser?.businessName,
            isFirstTimeLogginin: findUser?.isFirstTimeLogginin,

            createdAt: findUser?.createdAt,
          },
          EnvironmentalVariables.ACCESS_SECRET_KEY,
          { expiresIn: "600s" }
        );

        const refreshToken = jwt.sign(
          {
            _id: findUser?._id,
            email: findUser?.email,
          },
          EnvironmentalVariables.REFRESH_SECRET_KEY,
          { expiresIn: "2d" }
        );

        const token = {
          token: { accesstoken: accesstoken, refreshToken: refreshToken },
        };

        res.status(200).json({ message: "New token", data: token });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationKey, otp } = req.body;

    const otpHolder = await otpModel.find({ email });

    if (otpHolder === 0) {
      res.status(400).json({ message: "Expired OTP" });
    } else {
      const getRecentOtp = otpHolder[otpHolder.length - 1];
      const rightOtp = await bcrypt.compare(otp, getRecentOtp.otp);

      if (verificationKey === getRecentOtp.verificationKey) {
        if (!rightOtp) {
          res.status(400).json({ message: "Incorrect OTP" });
        } else {
          res.status(400).json({ message: "Email Verification Completed" });
        }
      } else {
        res.status(400).json({ message: "Invalid Verification key" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "error", error: error });
  }
};
