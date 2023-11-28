import express from "express";
import bcrypt from "bcrypt";
import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";
import otpGenerator from "otp-generator";
import { otpModel } from "../model/otp.model.js";
import { sendEmailToUsers } from "../config/sendMail.js";

const bcyrptPassword = async (password) => {
  const saltPassword = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, saltPassword);

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

    const hashPassword = await bcyrptPassword(password);

    const createUser = await userModel.create({
      email,
      password: hashPassword,
      businessName,
    });

    if (createUser) {
      const generatedOtp = generateOtpMethod(4, false, false);

      const hashOtp = await bcyrptPassword(generatedOtp);

      const verificationKey = generateOtpMethod(30, true, true);

      await otpModel.create({
        otp: hashOtp,
        verificationKey,
        email: email,
      });

      await sendEmailToUsers(email, generatedOtp, res);

      console.log("generated otp", generatedOtp);

      // send otp through email smtp

      res?.status(200).json({
        message: "User Created Successfully",
        data: { user: createUser, email, verificationKey },
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Error", data: error.message });
  }
};

export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      console.log("incorrect");
      res.status(400).json({ message: "Incorrect Credentail" });
    } else {
      const comparePassword = await bcrypt.compare(
        password,
        findUser?.password
      );

      if (!comparePassword) {
        res.status(400).json({ message: "Incorrect Credentail" });
      } else {
        if (!findUser?.isEmailVerified) {
          res
            .status(400)
            .json({ message: "Email not Verified", success: false });
        } else {
          const { password, ...userDataFromDB } = findUser._doc;

          const accesstoken = jwt.sign(
            userDataFromDB,
            EnvironmentalVariables.ACCESS_SECRET_KEY,
            // { expiresIn: "600s" }
            { expiresIn: "1d" }
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
            user: findUser,
            token: { accesstoken: accesstoken, refreshToken: refreshToken },
          };

          res
            ?.status(200)
            .json({ message: "User logged in successfully", data: userData });
        }
      }
    }
  } catch (error) {
    res.status(404).json({ message: "Error", error: error });
  }
};

export const createANewToken = async (req, res, next) => {
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

    const decodeToken = jwt.decode(refreshToken);

    const findUser = await userModel.findOne({ email: decodeToken?.email });

    const { password, ...userData } = findUser._doc;

    if (!findUser) {
      res.status(404).json({ message: "User not found" });
    } else {
      const accesstoken = jwt.sign(
        userData,
        EnvironmentalVariables.ACCESS_SECRET_KEY,
        // { expiresIn: "600s" }
        { expiresIn: "1d" }
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
  } catch (error) {
    res.status(400).json({ message: "error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, verificationKey, otp } = req.body;

    const otpHolder = await otpModel.find({ email });

    if (otpHolder === 0) {
      res.status(400).json({ message: "Expired OTP", success: false });
    } else {
      const getRecentOtp = otpHolder[otpHolder.length - 1];
      const rightOtp = await bcrypt.compare(otp, getRecentOtp.otp);

      if (verificationKey === getRecentOtp.verificationKey) {
        if (!rightOtp) {
          res.status(400).json({ message: "Incorrect OTP", success: false });
        } else {
          const findUser = await userModel.findOneAndUpdate(
            { email },
            { isEmailVerified: true },
            { new: true }
          );
          await otpModel.deleteMany({ email });
          res
            .status(400)
            .json({ message: "Email Verification Completed", success: true });
        }
      } else {
        res
          .status(400)
          .json({ message: "Invalid Verification key", success: false });
      }
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "error", data: error.message, success: false });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("hellod");

    const generatedOtp = generateOtpMethod(4, false, false);

    console.log("first generated otp", generatedOtp);

    const hashOtp = await bcyrptPassword(generatedOtp);

    const verificationKey = generateOtpMethod(30, true, true);

    await otpModel.create({
      otp: hashOtp,
      verificationKey,
      email: email,
    });

    await sendEmailToUsers(email, generatedOtp, res);

    console.log("genereated otp", generatedOtp);

    res.status(201).json({
      message: "Otp Resent",

      data: { verificationKey, email },
      success: true,
    });
  } catch (error) {
    res.status(400).json({ message: "error", error: error, success: false });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentUser = await userModel.findById(userId);
    res
      .status(200)
      .json({ message: "Current User", data: currentUser, success: true });
  } catch (error) {
    res
      .status(400)
      .json({ message: "error", error: error.message, success: false });
  }
};
