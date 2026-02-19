import Property from "../../models/propertySchema.js";
import Room from "../../models/roomSchema.js";

export const getProperties = async (req, res) => {
  try {
    const shopId = req.userId;
    const { page = 1, limit = 5, search = "", type = "" } = req.query;

    const query = { owner: shopId };

    if (search) {
      query.listingName = { $regex: search, $options: "i" };
    }

    if (type) {
      query.listingType = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalListings = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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
      pagination: {
        total: totalListings,
        page: parseInt(page),
        pages: Math.ceil(totalListings / limit),
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
