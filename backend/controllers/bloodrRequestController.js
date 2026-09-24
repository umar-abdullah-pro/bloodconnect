const BloodRequest = require("../models/BloodRequest");

const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, latitude, longitude, urgency, requiredBy } =
      req.body;

    if (
      !bloodGroup ||
      !units ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Blood group, units and location are required",
      });
    }

    const bloodRequest = await BloodRequest.create({
      requesterId: req.user._id,
      bloodGroup,
      units,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      urgency,
      requiredBy,
    });

    return res.status(201).json({
      success: true,
      message: "Blood request created successfully",
    });
  } catch (error) {
    console.error("Create blood request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMyBloodRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      requesterId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get blood requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { createBloodRequest, getMyBloodRequests };
