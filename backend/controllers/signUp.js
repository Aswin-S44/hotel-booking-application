import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/utils.js";
import { conflictResponse, successResponse } from "../utils/responseHelpers.js";

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
