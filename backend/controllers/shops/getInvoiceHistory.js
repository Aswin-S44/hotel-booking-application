import { format } from "date-fns";
import Bookings from "../../models/bookings.js";

export const getInvoiceHistory = async (req, res) => {
  try {
    const shopId = req.userId;
    const { page = 1, limit = 10, search = "", sort = "newest" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = { shopId };

    if (search) {
      query.$or = [
        { status: { $regex: search, $options: "i" } },
        { paymentStatus: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const totalEntries = await Bookings.countDocuments(query);
    const history = await Bookings.find(query)
      .populate("paymentId")
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const formattedHistory = history.map((booking) => ({
      paymentId: booking.paymentId?._id,
      date: booking.paymentId?.createdAt
        ? format(new Date(booking.paymentId.createdAt), "dd MMM yyyy")
        : format(new Date(booking.createdAt), "dd MMM yyyy"),
      amount: booking.totalAmount,
      status: booking.status,
    }));

    return res.status(200).json({
      data: formattedHistory,
      pagination: {
        totalEntries,
        totalPages: Math.ceil(totalEntries / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
