import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        actorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        type: {
            type: String,
            enum: ["BOOKING", "APPROVED", "REVIEW", "GENERAL"],
            required: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
