import express from "express";
import {
  sendEmailOTP,
  sendOTP,
  signUp,
  verifyOTPAndSignUp,
} from "../controllers/signUp.js";
import { sigIn } from "../controllers/signin.js";
import { getMe } from "../controllers/getMe.js";
import { googleLogin } from "../controllers/authController.js";

import { updateProfile } from "../controllers/shops/updateProfile.js";

import { userVerification } from "../middleware/AuthMiddleware.js";
import { getProfile } from "../controllers/common/getProfile.js";
import { updateEmail } from "../controllers/common/updateEmail.js";
import { updatePassword } from "../controllers/common/updatePassword.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", sigIn);
authRouter.post("/google-login", googleLogin);
authRouter.get("/me", getMe);
authRouter.patch("/profile", userVerification, updateProfile);

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTPAndSignUp);
authRouter.get("/profile", userVerification, getProfile);

authRouter.post("/send-email-otp", userVerification, sendEmailOTP);

authRouter.patch("/update/email", userVerification, updateEmail);
authRouter.patch("/update/password", userVerification, updatePassword);

export default authRouter;

// export default router;
