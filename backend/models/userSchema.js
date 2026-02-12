const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        isReplied: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;