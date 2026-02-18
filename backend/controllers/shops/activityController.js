import Activity from "../../models/activitySchema.js";
import mongoose from "mongoose";

// Get All Activities for Logged User
export const getUserActivities = async (req, res) => {
    try {
        const userId = req.user.id;

        const activities = await Activity.find({ userId })
            .populate("actorId", "name avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Single Activity
export const deleteActivity = async (req, res) => {
    try {
        const { activityId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(activityId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid activity ID",
            });
        }

        const activity = await Activity.findByIdAndDelete(activityId);

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete All Activities for User
export const deleteAllActivities = async (req, res) => {
    try {
        const userId = req.user.id;

        await Activity.deleteMany({ userId });

        res.status(200).json({
            success: true,
            message: "All activities deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
