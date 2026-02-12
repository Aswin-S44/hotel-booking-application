import express from "express";
import { verifySupabaseToken } from "../middleware/auth.js";

import {
    createBooking,
    getMyBookings,
    cancelBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// Create booking 
router.post("/", verifySupabaseToken, createBooking);

// Get logged-in user's bookings
router.get("/my", verifySupabaseToken, getMyBookings);

// Cancel booking
router.put("/:id/cancel", verifySupabaseToken, cancelBooking);

export default router;