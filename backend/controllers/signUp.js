import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/utils.js";
import { conflictResponse, successResponse } from "../utils/responseHelpers.js";
import OTP from "../models/otpSchema.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send(conflictResponse("User already exists with this email "));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: false,
    });

    const data = { user };

    return res.status(200).json(successResponse(data));
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(conflictResponse("User already exists"));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      {
        upsert: true,
        returnDocument: "after", // Change "new: true" to this
      }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    return res.status(200).json(successResponse(null, "OTP sent to email"));
  } catch (error) {
    console.log("Error------------", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOTPAndSignUp = async (req, res) => {
  try {
    const { email, password, otp, name } = req.body;

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
    });

    return res.status(201).json(successResponse({ user }));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
