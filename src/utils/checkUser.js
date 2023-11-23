import jwt from "jsonwebtoken";
import { EnvironmentalVariables } from "../config/EnvironmentalVariables.js";

export const checkUser = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    res
      .status(400)
      .json({ message: "You don't have right to perform this operation" });
  } else {
    const jwtToken = authToken.split(" ")[1];
    if (!jwtToken) {
      res
        .status(400)
        .json({ message: "You don't have right to perform this operation" });
    } else {
      jwt.verify(
        jwtToken,
        EnvironmentalVariables.SECRET_KEY,
        (err, payload) => {
          if (err) {
            res.status(400).json({ message: "Incorrect token", err: err });
          } else {
            req.user = payload;
            next();
          }
        }
      );
    }
  }
};
