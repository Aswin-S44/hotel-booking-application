import User from "../../models/userSchema.js";

export const updateEmail = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    console.log("USER----------------", user);
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    user.email = newEmail;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
