import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({
      _id: propertyId,
      // owner: req.userId,
    }).lean();

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const rooms = await Room.find({ property: propertyId }).lean();

    return res.status(200).json({
      success: true,
      data: {
        ...property,
        rooms: rooms,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
