import express from "express";
import { sendOTP, signUp, verifyOTPAndSignUp } from "../controllers/signUp.js";
import { sigIn } from "../controllers/signin.js";
import { getMe } from "../controllers/getMe.js";
import { googleLogin } from "../controllers/authController.js";
import { userVerification } from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/shops/updateProfile.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", sigIn);
authRouter.post("/google-login", googleLogin);
authRouter.get("/me", getMe);
authRouter.patch("/profile", userVerification, updateProfile);

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTPAndSignUp);

export default authRouter;

// export default router;
