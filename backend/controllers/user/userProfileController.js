import UserProfile from "../../models/userProfileSchema.js";
import User from "../../models/userSchema.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const {
      fullName,
      email,
      mobileNumber,
      nationality,
      dateOfBirth,
      gender,
      address,
    } = req.body;

    const profileImage = req.file?.path; // if using multer

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      profile = new UserProfile({ userId });
    }

    profile.fullName = fullName || profile.fullName;
    profile.email = email || profile.email;
    profile.mobileNumber = mobileNumber || profile.mobileNumber;
    profile.nationality = nationality || profile.nationality;
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.gender = gender || profile.gender;
    profile.address = address || profile.address;

    if (profileImage) {
      profile.profileImage = profileImage;
    }

    await profile.save();

    res.status(200).json({
      status: 200,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await User.findOne({ _id: userId });

    if (!profile) {
      return res.status(404).json({
        status: 404,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      status: 200,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
