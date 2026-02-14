import express from "express";
import { signUp } from "../controllers/signUp.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getProperties } from "../controllers/common/getProperties.js";
import { getRoomById } from "../controllers/common/getRoomById.js";
import { getRoomsByPropertyId } from "../controllers/common/getRoomsByPropertyId.js";
import { createOrder } from "../controllers/razorpay/createOrder.js";
import { createBooking } from "../controllers/createBooking.js";

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

export default customerRouter;
