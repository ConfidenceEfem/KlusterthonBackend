import nodemailer from "nodemailer";
import { google } from "googleapis";
import { EnvironmentalVariables } from "./EnvironmentalVariables.js";

const oAuthPass = new google.auth.OAuth2(
  EnvironmentalVariables.CLIENT_ID,
  EnvironmentalVariables.CLIENT_SECRET,
  EnvironmentalVariables.REDIRECT_URL
);

oAuthPass.setCredentials({
  refresh_token: EnvironmentalVariables.REFRESH_TOKEN
});

export const sendEmailToUsers = async (email, otp, res) => {
  try {
    console.log("hello");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EnvironmentalVariables.MAIL_USERNAME,
        pass: EnvironmentalVariables.MAIL_PSWD
      }
    });

    const mailOptions = {
      from: `Beta Finance<"confidenceefem1@gmail.com">`,
      to: email,
      subject: `${"Email Verification"}`,
      html: `Hello there,</b> <br/><br/> This is your OTP to Verify your email on <b>Beta Finance</b>: ${otp}.<br/><br/> <i>PS: OTP expires in 5 minutes time.</i> <br/><br/><b> Thanks, from Beta Finance Team</b> `
    };

    const result = transporter.sendMail(mailOptions, (err, info) => {
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
