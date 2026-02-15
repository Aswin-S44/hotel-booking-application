import mongoose from "mongoose";
import { getReviewsByRoomAndPropertyService } from "../../services/rating.service.js";
import { addReviewService } from "../../services/rating.service.js";


export const addReview = async (req, res) => {



  try {
    const { fromId, propertyId, roomId, feedback, rating } = req.body;

    if (!fromId || !propertyId || !roomId || !rating) {
      return res.status(400).json({
        success: false,
        message: "fromId, propertyId, roomId and rating are required",
      });
    }

    const review = await addReviewService({
      fromId,
      propertyId,
      roomId,
      feedback,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReviewsByRoomAndProperty = async (req, res) => {
   const { propertyId, roomId } = req.params;
   console.log("+++***",req.params);
console.log("+++",propertyId, roomId);

  try {
    const { propertyId, roomId } = req.params;
console.log("+++",propertyId, roomId);
    // 1️⃣ Missing parameters
    if (!propertyId || !roomId) {
      return res.status(400).json({
        success: false,
        message: "propertyId and roomId are required",
      });
    }

    // 2️⃣ Invalid ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(propertyId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid propertyId or roomId format",
      });
    }

    const reviews = await getReviewsByRoomAndPropertyService(
      propertyId,
      roomId
    );

    // 3️⃣ No reviews found
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this room in this property",
      });
    }

    // 4️⃣ Success
    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      totalReviews: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);

    // 5️⃣ Server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
