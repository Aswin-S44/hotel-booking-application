import express from "express";
import { signUp } from "../controllers/signUp.js";
import { sigIn } from "../controllers/signin.js";
import { getMe } from "../controllers/getMe.js";
import { googleLogin } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", sigIn);
authRouter.post("/google-login", googleLogin);
authRouter.get("/me", getMe);

export default authRouter;

// export default router;
