import mongoose from "mongoose";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import Bookings from "../../models/bookings.js";
import Stats from "../../models/statsSchema.js";

export const getEarningStats = async (req, res) => {
  try {
    const shopId = new mongoose.Types.ObjectId(req.userId);
    const now = new Date();

    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    const bookingStats = await Bookings.aggregate([
      {
        $match: {
          shopId: shopId,
          status: { $ne: "cancelled" },
          createdAt: { $gte: startOfLastMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: null,
          salesThisMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfCurrentMonth] },
                    { $lte: ["$createdAt", endOfCurrentMonth] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          earningsCurrentMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfCurrentMonth] },
                    { $lte: ["$createdAt", endOfCurrentMonth] },
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },
          earningsLastMonth: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", startOfLastMonth] },
                    { $lte: ["$createdAt", endOfLastMonth] },
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const generalStats = await Stats.findOne({ shopId });

    const result = {
      salesThisMonth: bookingStats[0]?.salesThisMonth || 0,
      earningsCurrentMonth: bookingStats[0]?.earningsCurrentMonth || 0,
      earningsLastMonth: bookingStats[0]?.earningsLastMonth || 0,
      listings: generalStats?.listings || 0,
      visitors: generalStats?.visitors || 0,
      reviews: generalStats?.reviews || 0,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
