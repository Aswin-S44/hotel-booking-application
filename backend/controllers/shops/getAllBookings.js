import Bookings from "../../models/bookings.js";
import { format } from "date-fns";

export const getAllBookings = async (req, res) => {
  try {
    const shopId = req.userId;
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const query = { shopId };

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const total = await Bookings.countDocuments(query);

    const bookings = await Bookings.find(query)
      .populate({
        path: "roomId",
        select: "roomName additionalInfo",
      })
      .select("checkInDate status paymentStatus roomId")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const data = bookings.map((booking) => ({
      _id: booking._id,
      roomName: booking.roomId?.roomName || null,
      additionalInfo: booking.roomId?.additionalInfo || null,
      checkInDate: booking.checkInDate
        ? format(new Date(booking.checkInDate), "dd MMM yyyy")
        : null,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
    }));

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
