import mongoose from "mongoose";
import Bookings from "../../models/bookings.js";

export const getGraphStats = async (req, res) => {
  try {
    const shopId = req.userId;

    const stats = await Bookings.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1),
            $lte: new Date(new Date().getFullYear(), 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyData = Array(12).fill(0);
    stats.forEach((item) => {
      monthlyData[item._id - 1] = item.count;
    });

    res.status(200).json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
