import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "google",
    },
    googleId: { type: String },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
