import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const createProperty = async (req, res) => {
  try {
    const { rooms, ...propertyData } = req.body;

    const newProperty = await Property.create({
      ...propertyData,
      owner: req.userId,
    });

    let createdRooms = [];
    if (rooms && Array.isArray(rooms) && rooms.length > 0) {
      const roomDataWithPropertyId = rooms.map((room) => ({
        ...room,
        property: newProperty._id,
      }));

      createdRooms = await Room.insertMany(roomDataWithPropertyId);
    }

    return res.status(201).json({
      success: true,
      message: "Property and rooms created successfully",
      data: {
        property: newProperty,
        rooms: createdRooms,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
