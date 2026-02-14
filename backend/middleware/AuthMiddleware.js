import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const userVerification = async (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.token;
  console.log("token-----------", token);
  if (!token) {
    return res.json({ status: 403, message: "Forebidden" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        req.user = user;
        req.userId = user._id;
        next();
      } else {
        return res.json({ status: false });
      }
    }
  });
};
