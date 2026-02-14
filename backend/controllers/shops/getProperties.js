import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const getProperties = async (req, res) => {
  try {
    const shopId = req.userId;

    const properties = await Property.find({ owner: shopId }).lean();

    const propertyIds = properties.map((p) => p._id);

    const rooms = await Room.find({ property: { $in: propertyIds } }).lean();

    const data = properties.map((property) => ({
      ...property,
      rooms: rooms.filter(
        (room) => room.property.toString() === property._id.toString()
      ),
    }));

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
