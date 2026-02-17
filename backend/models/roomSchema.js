import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomName: { type: String, required: true },
    roomThumbnail: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    additionalInfo: { type: String },

    isAvailable: { type: Boolean, default: true },

    roomArea: { type: Number },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
