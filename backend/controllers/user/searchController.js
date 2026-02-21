import Property from "../../models/propertySchema.js";

export const getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const properties = await Property.find({}).skip(skip).limit(limit);

    const total = await Property.countDocuments();

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    const query = {
      $or: [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ],
    };

    const totalHotels = await Property.countDocuments(query);

    const hotels = await Property.find(query).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      total: totalHotels,
      totalPages: Math.ceil(totalHotels / limit),
      currentPage: page,
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
