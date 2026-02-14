import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findOne({
      _id: propertyId,
      owner: req.userId,
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or unauthorized",
      });
    }

    await Room.deleteMany({ property: propertyId });

    await Property.findByIdAndDelete(propertyId);

    return res.status(200).json({
      success: true,
      message: "Property and associated rooms deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
