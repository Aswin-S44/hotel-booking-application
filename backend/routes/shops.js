import express from "express";
import { createProperty } from "../controllers/shops/createProperty.js";
import { userVerification } from "../middleware/AuthMiddleware.js";
import { getProperties } from "../controllers/shops/getProperties.js";
import { updateProperty } from "../controllers/shops/updateProperty.js";
import { deleteProperty } from "../controllers/shops/deleteProperty.js";

const shopsRouter = express.Router();

shopsRouter.get("/", (req, res) => {
  res.json({ message: "shopsRouter route" });
});

shopsRouter.post("/booking", userVerification, createProperty);
shopsRouter.get("/bookings", userVerification, getProperties);
shopsRouter.patch("/bookings", userVerification, updateProperty);
shopsRouter.delete("/bookings/:propertyId", userVerification, deleteProperty);

export default shopsRouter;
