import express from "express";
import { createProperty } from "../controllers/shops/createProperty.js";

import { getProperties } from "../controllers/shops/getProperties.js";
import { updateProperty } from "../controllers/shops/updateProperty.js";
import { deleteRoomById } from "../controllers/shops/deleteProperty.js";
import { getAllBookings } from "../controllers/shops/getAllBookings.js";
import { getStats } from "../controllers/shops/getStats.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getListingsCount } from "../controllers/shops/getListingsCount.js";
import { getGraphStats } from "../controllers/shops/getGraphStats.js";
import { getReviews } from "../controllers/shops/getReviews.js";
import { getInvoiceHistory } from "../controllers/shops/getInvoiceHistory.js";
import { getEarningStats } from "../controllers/shops/getEarningStats.js";
import {
  deleteActivity,
  deleteAllActivities,
  getUserActivities,
} from "../controllers/shops/activityController.js";
import { updateProfile } from "../controllers/shops/updateProfile.js";
import { userVerification } from "../middleware/AuthMiddleware.js";
import { updateRoomById } from "../controllers/shops/updateRoomById.js";
import { deleteReviewById } from "../controllers/shops/deleteReviewById.js";
import { replyToReview } from "../controllers/shops/replyToReview.js";

const shopsRouter = express.Router();

shopsRouter.get("/", (req, res) => {
  res.json({ message: "shopsRouter route" });
});

shopsRouter.post("/property", userVerification, createProperty);
shopsRouter.get("/property/:propertyId", getPropertyById);
shopsRouter.get("/rooms", userVerification, getProperties);
shopsRouter.patch("/property/:propertyId", userVerification, updateProperty);
shopsRouter.delete("/rooms/:roomId", userVerification, deleteRoomById);
shopsRouter.get("/bookings", userVerification, getAllBookings);
shopsRouter.get("/stats", userVerification, getStats);
shopsRouter.post("/listing", userVerification);
shopsRouter.get("/listings/count", userVerification, getListingsCount);
shopsRouter.get("/stats/graph", userVerification, getGraphStats);
shopsRouter.get("/reviews", userVerification, getReviews);
shopsRouter.get("/invoices", userVerification, getInvoiceHistory);
shopsRouter.get("/earning-statuses", userVerification, getEarningStats);
shopsRouter.get("/activity", userVerification, getUserActivities);
shopsRouter.delete("/activity/:activityId", userVerification, deleteActivity);
shopsRouter.delete("/activity", userVerification, deleteAllActivities);
shopsRouter.patch("/profile", userVerification, updateProfile);
shopsRouter.patch("/room/:roomId", userVerification, updateRoomById);
shopsRouter.delete("/reviews/:id", userVerification, deleteReviewById);
shopsRouter.patch("/reviews/:id/reply", userVerification, replyToReview);
export default shopsRouter;
