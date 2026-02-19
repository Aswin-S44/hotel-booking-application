import User from "../models/userSchema.js";

import jwt from "jsonwebtoken";

export const getMe = async (req, res) => {
  const token = req.header["Authorization"] || req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET || "secret_key",
    async (err, data) => {
      if (err) {
        return res.json({ status: false });
      } else {
        const user = await User.findById(data.id);

        if (user)
          return res.json({
            success: true,
            user: user.firstName,
            userId: user._id,
            user,
          });
        else return res.json({ status: false });
      }
    }
  );
};
