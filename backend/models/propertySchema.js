import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingType: { type: String, required: true },
    listingName: { type: String, required: true, trim: true },
    listingUse: {
      type: String,
      enum: ["Entire Place", "For Guests", "For Personal"],
      default: "Entire Place",
    },
    shortDescription: { type: String, required: true },

    location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      street: { type: String, required: true },
      postalCode: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },

    amenities: [{ type: String }],
    description: { type: String },

    thumbnail: { type: String, required: true },
    gallery: [{ type: String }],

    policy: {
      description: { type: String },
      cancellationOption: { type: String },
      extraCharges: { type: Number, default: 0 },
    },

    currency: { type: String, default: "USD" },
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    starRating: { type: Number, min: 1, max: 5 },

    totalFloors: { type: Number },
    totalRooms: { type: Number },
    propertyArea: { type: Number },

    status: {
      type: String,
      enum: ["active", "draft", "hidden"],
      default: "active",
    },
  },
  { timestamps: true }
);

PropertySchema.index({ "location.coordinates": "2dsphere" });

const Property = mongoose.model("Property", PropertySchema);

export default Property;
