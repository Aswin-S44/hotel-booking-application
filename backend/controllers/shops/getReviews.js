import Room from "../../models/roomSchema.js";
import Rating from "../../models/reviewsSchema.js";

export const getReviews = async (req, res) => {
  try {
    const shopId = req.user.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const shopRooms = await Room.find({ shop: shopId }).select("_id");
    const roomIds = shopRooms.map((room) => room._id);

    const stats = await Rating.aggregate([
      { $match: { roomId: { $in: roomIds } } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          newReviews: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    const reviews = await Rating.find({ roomId: { $in: roomIds } })
      .populate("fromId", "firstName lastName profilePic email")
      .populate("propertyId", "listingName location thumbnail")
      .populate("roomId", "roomName roomThumbnail price")
      .sort({ createdAt: -1 });

    const result = {
      totalReviews: stats[0]?.totalReviews || 0,
      averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
      newReviewsCount: stats[0]?.newReviews || 0,
      reviews,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};
