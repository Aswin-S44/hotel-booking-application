import Room from "../../models/roomSchema.js";

export const deleteRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({
      _id: roomId,
      owner: req.userId,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found ",
      });
    }

    await Room.deleteMany({ _id: roomId });

    return res.status(200).json({
      success: true,
      message: "Rooms deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
