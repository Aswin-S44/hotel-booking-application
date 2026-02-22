import mongoose from "mongoose";
import Property from "../../models/propertySchema.js";
import Rating from "../../models/reviewsSchema.js";

export const getFavoriteProperties = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Property IDs are required",
            });
        }

        const validIds = ids
            .filter((id) => mongoose.Types.ObjectId.isValid(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        const properties = await Property.aggregate([
            {
                $match: {
                    _id: { $in: validIds },
                    status: "active",
                },
            },
            {
                $lookup: {
                    from: "ratings",
                    localField: "_id",
                    foreignField: "propertyId",
                    as: "allRatings",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                },
            },
            {
                $unwind: {
                    path: "$owner",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    averageRating: { $ifNull: [{ $avg: "$allRatings.rating" }, 0] },
                    totalReviews: { $size: "$allRatings" },
                    roomRatings: {
                        $map: {
                            input: { $setUnion: "$allRatings.roomId" },
                            as: "rId",
                            in: {
                                roomId: "$$rId",
                                averageRating: {
                                    $avg: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: "$allRatings",
                                                    as: "rate",
                                                    cond: { $eq: ["$$rate.roomId", "$$rId"] }
                                                }
                                            },
                                            as: "filtered",
                                            in: "$$filtered.rating"
                                        }
                                    }
                                },
                                reviews: {
                                    $filter: {
                                        input: "$allRatings",
                                        as: "rate",
                                        cond: { $eq: ["$$rate.roomId", "$$rId"] }
                                    }
                                }
                            }
                        }
                    }
                },
            },
            {
                $project: {
                    allRatings: 0
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            count: properties.length,
            data: properties,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch favorite properties",
            error: error.message,
        });
    }
};