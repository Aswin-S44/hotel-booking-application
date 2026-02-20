import Bookings from "../models/bookings.js";
export const cancelBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.userId;

    const booking = await Bookings.findOne({
      _id: bookingId,
      bookedUserId: userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you are not authorized to cancel it",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled",
      });
    }

    if (booking.status !== "booked") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`,
      });
    }

    const checkInTime = new Date(booking.checkInDate).getTime();
    const currentTime = new Date().getTime();
    const hoursDifference = (checkInTime - currentTime) / (1000 * 60 * 60);

    if (hoursDifference < 3) {
      return res.status(400).json({
        success: false,
        message:
          "Cancellations are only allowed at least 3 hours before check-in time",
      });
    }

    booking.status = "cancelled";

    if (booking.paymentType === "online" && booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
