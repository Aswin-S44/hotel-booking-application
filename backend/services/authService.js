import admin from "../config/firebase.js";
import User from "../models/userSchema.js";

export const googleLoginService = async (idToken) => {
  const decoded = await admin.auth().verifyIdToken(idToken);

  const { uid, email, name, picture } = decoded;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId: uid,
      avatar: picture,
      provider: "google",
    });
  }

  if (user.isBlocked) {
    throw new Error("User is blocked");
  }

  return user;
};
