import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    checkInDate: {
      type: Date,
      required: true,
    },

    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: "Check-out date must be after check-in date",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["booked", "checked_in", "checked_out", "cancelled"],
      default: "booked",
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    trafficSource: {
  type: String,
  enum: ["organic", "google", "social_media", "referral"],
  default: "organic",
},

utm: {
  source: String,
  medium: String,
  campaign: String,
},
guestDetails: {
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
},

    
  },
  {
    timestamps: true,
  }
  


  
);

const Bookings = mongoose.model("Bookings", bookingsSchema);

export default Bookings;
