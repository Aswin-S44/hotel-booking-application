import Room from "../../models/roomSchema.js";
import Stats from "../../models/statsSchema.js";

export const getListingsCount = async (req, res) => {
  try {
    const shopId = req.userId;

    const [availableRooms, bookedRooms, shopStats] = await Promise.all([
      Room.countDocuments({ shop: shopId, isAvailable: true }),
      Room.countDocuments({ shop: shopId, isAvailable: false }),
      Stats.findOne({ shopId: shopId }),
    ]);

    return res.status(200).send({
      success: true,
      data: {
        availableRooms,
        bookedRooms,
        totalListings: availableRooms + bookedRooms,
        earnings: shopStats ? shopStats.earnings : 0,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
