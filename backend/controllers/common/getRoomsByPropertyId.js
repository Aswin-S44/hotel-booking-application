import Room from "../../models/roomSchema.js";

export const getRoomsByPropertyId = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const rooms = await Room.find({
      property: propertyId,
    }).lean();

    if (!rooms) {
      return res.status(404).json({
        success: false,
        message: "Rooms not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        rooms,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
