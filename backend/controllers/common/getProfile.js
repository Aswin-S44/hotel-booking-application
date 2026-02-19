import User from "../../models/userSchema.js";

export const getProfile = async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(404).send({ message: "User not found" });
  }

  const user = await User.findById(userId);

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(404).send({ message: "User not found" });
  }
};
