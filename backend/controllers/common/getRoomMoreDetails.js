import Room from "../../models/roomSchema.js";

export const getRoomMoreDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId)
      .populate({
        path: "property",
      })
      .populate("shop");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
