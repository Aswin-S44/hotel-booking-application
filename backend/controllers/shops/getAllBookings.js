import Bookings from "../../models/bookings.js";
import { format } from "date-fns";

export const getAllBookings = async (req, res) => {
  try {
    const shopId = req.userId;
    const { page = 1, limit = 10, status, paymentStatus, filter } = req.query;

    const query = { shopId };

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (filter === "upcoming") {
      query.checkInDate = { $gte: new Date() };
    }

    const total = await Bookings.countDocuments(query);

    const bookings = await Bookings.find(query)
      .populate({
        path: "roomId",
        select: "roomName additionalInfo",
      })
      .populate({
        path: "propertyId",
        select: "propertyName address",
      })
      .populate({
        path: "paymentId",
        select: "paymentMethod transactionId",
      })
      .select("checkInDate checkOutDate status paymentStatus roomId totalAmount propertyId paymentId trafficSource utm")
      .sort(filter === "upcoming" ? { checkInDate: 1 } : { createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const data = bookings.map((booking) => ({
      _id: booking._id,

      propertyName: booking.propertyId?.propertyName || null,
      propertyId: booking.propertyId?._id || null,

      roomName: booking.roomId?.roomName || null,
      roomId: booking.roomId?._id || null,
      additionalInfo: booking.roomId?.additionalInfo || null,

      checkInDate: booking.checkInDate
        ? format(new Date(booking.checkInDate), "dd MMM yyyy")
        : null,

      checkOutDate: booking.checkOutDate
        ? format(new Date(booking.checkOutDate), "dd MMM yyyy")
        : null,

      totalAmount: booking.totalAmount,

      status: booking.status,
      paymentStatus: booking.paymentStatus,

      paymentDetails: booking.paymentId || null,

      trafficSource: booking.trafficSource,
      utm: booking.utm || null,
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
