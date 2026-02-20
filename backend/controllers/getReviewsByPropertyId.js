import Rating from "../models/reviewsSchema.js";

export const getReviewsByPropertyId = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // We fetch all ratings to keep the summary (average/distribution) accurate
    const allReviewsForSummary = await Rating.find({ propertyId: id }).select(
      "rating"
    );

    // Fetch paginated data
    const reviews = await Rating.find({ propertyId: id })
      .populate("fromId", "name lastName email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = allReviewsForSummary.length;
    let sumRating = 0;
    const distribution = {
      5: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      1: { count: 0, percentage: 0 },
    };

    allReviewsForSummary.forEach((rev) => {
      const ratingVal = Math.round(rev.rating || 0);
      sumRating += rev.rating || 0;
      if (distribution[ratingVal]) {
        distribution[ratingVal].count += 1;
      }
    });

    const processedReviews = reviews.map((review) => {
      const reviewData = review.toObject();
      if (!reviewData.fromId) {
        reviewData.fromId = {
          firstName: "Verified",
          lastName: "Guest",
          email: "guest@example.com",
        };
      }
      return reviewData;
    });

    const averageRating =
      totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : 0;

    if (totalReviews > 0) {
      Object.keys(distribution).forEach((key) => {
        distribution[key].percentage = Math.round(
          (distribution[key].count / totalReviews) * 100
        );
      });
    }

    return res.status(200).json({
      success: true,
      summary: {
        averageRating: parseFloat(averageRating),
        totalReviews,
        ratingDistribution: distribution,
      },
      data: processedReviews,
      hasMore: totalReviews > skip + reviews.length,
    });
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
