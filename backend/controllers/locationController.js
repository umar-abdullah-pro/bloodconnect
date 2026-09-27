const {
  geocodeLocation,
  reverseGeocodeLocation,
} = require("../services/geocodingService");

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

const reverseSearchLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const result = await reverseGeocodeLocation(latitude, longitude);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Location could not be found",
      });
    }

    return res.status(200).json({
      success: true,
      locationName: result.formatted,
    });
  } catch (error) {
    console.error("Reverse location search error:", error);

    return res.status(500).json({
      success: false,
      message: "Location lookup failed",
    });
  }
};

module.exports = { searchLocation, reverseSearchLocation };
