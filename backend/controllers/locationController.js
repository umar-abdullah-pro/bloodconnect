const { geocodeLocation } = require("../services/geocodingService");

const searchLocation = async (req, res) => {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    const results = await geocodeLocation(location);

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Location search error:", error);

    return res.status(500).json({
      success: false,
      message: "Location search failed",
    });
  }
};

module.exports = { searchLocation };
