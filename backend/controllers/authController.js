import { googleLoginService } from "../services/authService.js";

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const user = await googleLoginService(idToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
};
