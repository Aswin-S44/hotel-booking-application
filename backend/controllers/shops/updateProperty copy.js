import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const updateProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rooms, ...updateData } = req.body;

    const property = await Property.findOne({
      _id: propertyId,
      // owner: req.userId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or unauthorized",
      });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (rooms && Array.isArray(rooms)) {
      await Room.deleteMany({ property: propertyId });

      if (rooms.length > 0) {
        const roomDataWithPropertyId = rooms.map((room) => ({
          ...room,
          property: propertyId,
        }));
        await Room.insertMany(roomDataWithPropertyId);
      }
    }

    const finalRooms = await Room.find({ property: propertyId });

    return res.status(200).json({
      success: true,
      message: "Property and rooms updated successfully",
      data: {
        property: updatedProperty,
        rooms: finalRooms,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
