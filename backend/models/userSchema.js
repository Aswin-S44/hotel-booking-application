import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "shops"],
      default: "customer",
      required: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "google",
    },
    googleId: { type: String },
    avatar: { type: String },
    isBlocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
