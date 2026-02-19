import Rating from "../../models/reviewsSchema.js";

export const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const shopId = req.userId;

    if (!id || !shopId) {
      return res.status(404).send({ message: "Invalid params" });
    }

    const review = await Rating.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await Rating.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
