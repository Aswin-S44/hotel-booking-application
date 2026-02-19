import mongoose from "mongoose";
import Bookings from "../models/bookings.js";

export const getTrafficStats = async (req, res) => {
    try {
        const { shopId } = req.params;

        const totalBookings = await Bookings.countDocuments({
            shopId: new mongoose.Types.ObjectId(shopId),
        });

        const trafficData = await Bookings.aggregate([
            { $match: { shopId: new mongoose.Types.ObjectId(shopId) } },
            {
                $group: {
                    _id: { $ifNull: ["$trafficSource", "organic"] },
                    count: { $sum: 1 }
                }
            }
        ]);


        const formattedData = trafficData.map((item) => ({
            name: item._id,
            value: item.count,
            percentage: ((item.count / totalBookings) * 100).toFixed(2),
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
