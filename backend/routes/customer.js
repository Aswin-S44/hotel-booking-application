import express from "express";
import { signUp } from "../controllers/signUp.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getProperties } from "../controllers/common/getProperties.js";

const customerRouter = express.Router();
customerRouter.get("/", (req, res) => {
  res.json({ message: "Customer route" });
});

customerRouter.post("/signup", signUp);
customerRouter.get("/property/:propertyId", getPropertyById);
customerRouter.get("/properties", getProperties);

export default customerRouter;
