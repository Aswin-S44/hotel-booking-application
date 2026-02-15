import express from "express";
import { createProperty } from "../controllers/shops/createProperty.js";
import { userVerification } from "../middleware/authMiddleware.js";
import { getProperties } from "../controllers/shops/getProperties.js";
import { updateProperty } from "../controllers/shops/updateProperty.js";
import { deleteProperty } from "../controllers/shops/deleteProperty.js";
import { getAllBookings } from "../controllers/shops/getAllBookings.js";
import { getStats } from "../controllers/shops/getStats.js";

const shopsRouter = express.Router();

shopsRouter.get("/", (req, res) => {
  res.json({ message: "shopsRouter route" });
});

shopsRouter.post("/rooms", userVerification, createProperty);
shopsRouter.get("/rooms", userVerification, getProperties);
shopsRouter.patch("/rooms", userVerification, updateProperty);
shopsRouter.delete("/rooms/:propertyId", userVerification, deleteProperty);
shopsRouter.get("/bookings", userVerification, getAllBookings);
shopsRouter.get("/stats", userVerification, getStats);

export default shopsRouter;
