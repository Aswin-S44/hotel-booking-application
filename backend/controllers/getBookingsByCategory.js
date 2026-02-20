import Bookings from "../models/bookings.js";

export const getBookingsByCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { type } = req.query;

    const filter = { bookedUserId: userId };

    if (
      type &&
      ["booked", "checked_in", "checked_out", "cancelled"].includes(type)
    ) {
      filter.status = type;
    }

    const bookings = await Bookings.find(filter)
      .populate("propertyId", "listingName location avatar images")
      .populate("roomId", "roomType price")
      .populate("shopId", "name email contactNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
