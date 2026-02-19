import Property from "../../models/propertySchema.js";

export const getNearbyProperties = async (req, res) => {
    try {
        const { lat, lng, limit = 12 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: "Latitude and Longitude required",
            });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        const properties = await Property.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    distanceField: "distance",
                    spherical: true,
                    query: { status: "active" },
                },
            },
            { $limit: parseInt(limit) },
        ]);

        const averageSpeed = 60; // km per hour

        const formattedData = properties.map((item) => {
            const distanceKm = item.distance / 1000;
            const timeHours = distanceKm / averageSpeed;

            let driveText;

            if (timeHours < 1) {
                const minutes = Math.round(timeHours * 60);
                driveText = `${minutes} mins drive`;
            } else {
                const hours = Math.floor(timeHours);
                const minutes = Math.round((timeHours - hours) * 60);

                driveText =
                    minutes > 0
                        ? `${hours} hr ${minutes} mins drive`
                        : `${hours} hours drive`;
            }

            return {
                ...item,
                distanceKm: distanceKm.toFixed(2),
                driveTime: driveText,
            };
        });

        res.status(200).json({
            success: true,
            count: formattedData.length,
            data: formattedData,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};