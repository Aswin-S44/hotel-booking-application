import express from "express";
import { signUp } from "../controllers/signUp.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getProperties } from "../controllers/common/getProperties.js";
import { getRoomById } from "../controllers/common/getRoomById.js";
import { getRoomsByPropertyId } from "../controllers/common/getRoomsByPropertyId.js";
import { createOrder } from "../controllers/razorpay/createOrder.js";
import { createBooking } from "../controllers/createBooking.js";
import { getReviewsByRoomAndProperty, addReview, getReviewsByProperty } from "../controllers/user/rating.controller.js";
import { getAllProperties, searchByLocation } from "../controllers/user/searchController.js";
import { upload } from "../middleware/upload.js";

const customerRouter = express.Router();
customerRouter.get("/", (req, res) => {
    res.json({ message: "Customer route" });
});

customerRouter.post("/signup", signUp);
customerRouter.get("/property/:propertyId", getPropertyById);
customerRouter.get("/properties", getProperties);
customerRouter.get("/rooms/:roomId", getRoomById);
customerRouter.get("/rooms/property/:propertyId", getRoomsByPropertyId);
customerRouter.post("/create-order", createOrder);
customerRouter.post("/booking/:propertyId/:roomId", createBooking);
customerRouter.get("/property/:propertyId/review/:roomId", getReviewsByRoomAndProperty);
customerRouter.post("/review", addReview);
customerRouter.get("/search-location", searchByLocation);
customerRouter.get("/properties", getAllProperties);
customerRouter.post("/add-review",upload.array("reviewImages", 5),addReview);
customerRouter.get("/property/:propertyId",getReviewsByProperty);


export default customerRouter;
