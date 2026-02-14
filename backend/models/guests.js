import mongoose from "mongoose";

const guestsSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialRequests: [],
    selectedPaymentTypeId: { type: Number, required: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bookings",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Guests = mongoose.model("Guests", guestsSchema);

export default Guests;
