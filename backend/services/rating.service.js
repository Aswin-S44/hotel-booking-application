import Rating from "../models/reviewsSchema.js";
import mongoose from "mongoose";

export const getReviewsByRoomAndPropertyService = async (
  propertyId,
  roomId
) => {
  if (
    !mongoose.Types.ObjectId.isValid(propertyId) ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    throw new Error("Invalid propertyId or roomId");
  }

  const reviews = await Rating.find({
    propertyId: propertyId,
    roomId: roomId,
  })
    .populate("fromId", "name email")
    .populate("propertyId", "title")
    .sort({ createdAt: -1 });

  return reviews;
};


export const addReviewService = async ({
  fromId,
  propertyId,
  roomId,
  feedback,
  rating,
  reviewImages,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(fromId) ||
    !mongoose.Types.ObjectId.isValid(propertyId) ||
    !mongoose.Types.ObjectId.isValid(roomId)
  ) {
    throw new Error("Invalid ID format");
  }

  if (!rating || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const existingReview = await Rating.findOne({
    fromId,
    propertyId,
    roomId,
  });

  if (existingReview) {
    throw new Error("You have already reviewed this room");
  }

  const newReview = await Rating.create({
    fromId,
    propertyId,
    roomId,
    feedback,
    rating,
    reviewImages,
  });

  return newReview;
};



export const getReviewsByPropertyService = async (propertyId) => {
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    throw new Error("Invalid propertyId");
  }

  return await Rating.find({
    propertyId: new mongoose.Types.ObjectId(propertyId),
  }).sort({ createdAt: -1 });
};
