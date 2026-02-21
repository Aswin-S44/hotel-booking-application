import express from "express";
import { signUp } from "../controllers/signUp.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getProperties } from "../controllers/common/getProperties.js";
import { getRoomById } from "../controllers/common/getRoomById.js";
import { getRoomsByPropertyId } from "../controllers/common/getRoomsByPropertyId.js";
import { createOrder } from "../controllers/razorpay/createOrder.js";
import { createBooking } from "../controllers/createBooking.js";
import {
  getReviewsByRoomAndProperty,
  addReview,
  getReviewsByProperty,
} from "../controllers/user/rating.controller.js";
import {
  getAllProperties,
  searchByLocation,
} from "../controllers/user/searchController.js";
import { upload } from "../middleware/upload.js";
import { getRoomMoreDetails } from "../controllers/common/getRoomMoreDetails.js";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user/userProfileController.js";
import { userVerification } from "../middleware/AuthMiddleware.js";
import { getReviewsByPropertyId } from "../controllers/getReviewsByPropertyId.js";
import { getReviewsByRoomId } from "../controllers/getReviewsByRoomId.js";
// import { getUserProfile, updateUserProfile } from "../controllers/user/userProfileController.js";

import { getNearbyProperties } from "../controllers/user/getNearbyPropertiesController.js";
import { getBookingsByCategory } from "../controllers/getBookingsByCategory.js";
import { cancelBookingById } from "../controllers/cancelBookingById.js";
import { getFavoriteProperties } from "../controllers/user/favController.js";

const customerRouter = express.Router();
customerRouter.get("/", (req, res) => {
  res.json({ message: "Customer route" });
});

// customerRouter.get("/:propertyId", getPropertyById);

customerRouter.post("/signup", signUp);
customerRouter.get("/property/:propertyId", getPropertyById);
customerRouter.get("/properties", getProperties);
customerRouter.get("/rooms/:roomId", getRoomById);
customerRouter.get("/rooms/property/:propertyId", getRoomsByPropertyId);
customerRouter.post("/create-order", createOrder);
customerRouter.post(
  "/booking/:propertyId/:roomId",
  userVerification,
  createBooking
);
customerRouter.get(
  "/property/:propertyId/review/:roomId",
  getReviewsByRoomAndProperty
);
customerRouter.post("/review", addReview);
customerRouter.get("/search-location", searchByLocation);
customerRouter.get("/properties/all", getAllProperties);
customerRouter.get("/all/properties", getAllProperties);
customerRouter.post("/add-review", upload.array("reviewImages", 5), addReview);
customerRouter.get("/property/:propertyId", getReviewsByProperty);

customerRouter.get("/rooms/:roomId/all", getRoomMoreDetails);
// customerRouter.post("/add-review",upload.array("reviewImages", 5),addReview);
customerRouter.get("/property/reviews/:propertyId", getReviewsByProperty);

customerRouter.put(
  "/update-profile",
  userVerification,
  upload.single("profileImage"),
  updateUserProfile
);
customerRouter.get("/profile/details", userVerification, getUserProfile);
customerRouter.get("/reviews-by-property-id/:id", getReviewsByPropertyId);
customerRouter.get("/reviews-by-room-id/:id", getReviewsByRoomId);
customerRouter.get("/nearby", getNearbyProperties);
customerRouter.post("/favorites", getFavoriteProperties);

customerRouter.get("/:propertyId", getPropertyById);

customerRouter.get(
  "/bookings/category",
  userVerification,
  getBookingsByCategory
);

customerRouter.patch(
  "/booking/cancel/:bookingId",
  userVerification,
  cancelBookingById
);

export default customerRouter;
