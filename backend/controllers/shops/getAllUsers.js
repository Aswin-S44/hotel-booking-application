import User from "../../models/userSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      search,
      isBlocked,
    } = req.query;

    const query = { role: "customer" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (isBlocked !== undefined) {
      query.isBlocked = isBlocked === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select("-password -otp -otpExpires"),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
