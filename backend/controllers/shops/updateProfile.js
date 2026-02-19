import User from "../../models/userSchema.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("BODY------------", req.body);

    const updateData = {
      name: req.body.name,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      birthday: req.body.birthday,
    };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await User.updateOne({ _id: userId }, { $set: updateData });

    res.status(200).send({ success: true, message: "Profile updated" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
