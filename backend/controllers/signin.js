import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/utils.js";

export const sigIn = async (req, res) => {
  try {
    console.log("1211111111111");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ status: 400, message: "Incorrect password or email" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect password or email" });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    let loggedInUser = user;
    loggedInUser["token"] = token;

    res.status(201).json({
      status: 200,
      message: "User logged in successfully",
      success: true,
      user: loggedInUser,
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
