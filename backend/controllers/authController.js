import { googleLoginService } from "../services/authService.js";
import { createSecretToken } from "../utils/utils.js";

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const user = await googleLoginService(idToken);

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

    // res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   user,
    // });
  } catch (error) {
    next(error);
  }
};
