import Property from "../../models/propertySchema.js";

// export const searchHotels = async (req, res) => {
//     try {
//         const {
//             keyword,
//             minPrice,
//             maxPrice,
//             customerRating,
//             starRating,
//             hotelType,
//             freeCancellation,
//             payAtHotel,
//             freeBreakfast,
//             amenities,
//             sortBy,
//             page = 1,
//             limit = 10,
//         } = req.query;

//         let query = {};

//         // 🔎 Hotel Name Search
//         if (keyword) {
//             query.listingName = { $regex: keyword, $options: "i" };
//         }

//         // 💰 Price Filter
//         if (minPrice || maxPrice) {
//             query.basePrice = {};
//             if (minPrice) query.basePrice.$gte = Number(minPrice);
//             if (maxPrice) query.basePrice.$lte = Number(maxPrice);
//         }

//         // ⭐ Customer Rating (minimum rating)
//         if (customerRating) {
//             query.starRating = { $gte: Number(customerRating) };
//         }

//         // ⭐ Exact Star Rating
//         if (starRating) {
//             query.starRating = Number(starRating);
//         }

//         // 🏨 Hotel Type
//         if (hotelType) {
//             query.listingType = hotelType;
//         }

//         // 📜 Free Cancellation
//         if (freeCancellation === "true") {
//             query["policy.cancellationOption"] = "Free Cancellation";
//         }

//         // 📜 Pay At Hotel (you must store this in policy)
//         if (payAtHotel === "true") {
//             query["policy.payAtHotel"] = true;
//         }

//         // 📜 Free Breakfast
//         if (freeBreakfast === "true") {
//             query.amenities = { $in: ["Free Breakfast"] };
//         }

//         // 🧰 Amenities (multiple)
//         if (amenities) {
//             const amenitiesArray = amenities.split(",");
//             query.amenities = { $all: amenitiesArray };
//         }

//         // 📊 Sorting
//         let sortOption = {};

//         switch (sortBy) {
//             case "recent":
//                 sortOption = { createdAt: -1 };
//                 break;
//             case "popular":
//                 sortOption = { totalRooms: -1 };
//                 break;
//             case "topRated":
//                 sortOption = { starRating: -1 };
//                 break;
//             default:
//                 sortOption = { createdAt: -1 };
//         }

//         const hotels = await Property.find(query)
//             .sort(sortOption)
//             .skip((page - 1) * limit)
//             .limit(Number(limit));

//         const total = await Property.countDocuments(query);

//         res.status(200).json({
//             success: true,
//             total,
//             page: Number(page),
//             totalPages: Math.ceil(total / limit),
//             data: hotels,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Search failed",
//             error: error.message,
//         });
//     }
// };



export const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    const hotels = await Property.find({
      $or: [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } }
      ]
    });

    res.status(200).json({
      success: true,
      total: hotels.length,
      data: hotels
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
