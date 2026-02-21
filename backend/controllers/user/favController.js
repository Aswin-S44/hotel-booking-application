import mongoose from "mongoose";
import Property from "../../models/propertySchema.js";

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

        const properties = await Property.find({
            _id: { $in: validIds },
            status: "active",
        }).populate("owner", "name email");

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