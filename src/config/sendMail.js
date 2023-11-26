import nodemailer from "nodemailer";
import { google } from "googleapis";
import { EnvironmentalVariables } from "./EnvironmentalVariables.js";

const oAuthPass = new google.auth.OAuth2(
  EnvironmentalVariables.CLIENT_ID,
  EnvironmentalVariables.CLIENT_SECRET,
  EnvironmentalVariables.REDIRECT_URL
);

oAuthPass.setCredentials({
  refresh_token: EnvironmentalVariables.REFRESH_TOKEN,
});

export const sendEmailToUsers = async (email, otp, res) => {
  try {
    console.log("hello");
    const createToken = await oAuthPass.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "smartdevopss@gmail.com",
        clientId: EnvironmentalVariables.CLIENT_ID,
        clientSecret: EnvironmentalVariables.CLIENT_SECRET,
        refreshToken: EnvironmentalVariables.REFRESH_TOKEN,
        accessToken: createToken.token,
      },
    });

    console.log("hello1");

    const mailOptions = {
      from: `Auth Pratice <"confidenceefem1@gmail.com">`,
      to: email,
      subject: `${"Email Verification"}`,
      html: `Hello there,</b> <br/> This is your OTP to Verify your email on <b>Beta Finance</b>: ${otp}.<br/> <i>OTP expires in 5 minutes time. <br/> Thanks, from Beta Finance Team</i> `,
    };

    const result = transporter.sendMail(mailOptions, (err, info) => {
      console.log("hello2");

      if (err) {
        console.log(err);
        console.log(err.message);
        if (res !== undefined) {
          res.status(400).json({ message: err.message });
        }
      } else {
        console.log("hello successful");

        console.log(info.response);
      }
    });

    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
