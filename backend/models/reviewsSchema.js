import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    feedback: { type: String },
    rating: { type: Number },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", reviewsSchema);

export default Rating;
