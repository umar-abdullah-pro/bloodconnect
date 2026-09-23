const DonorProfile = require("../models/DonorProfile");

const createDonorProfile = async (req, res) => {
  try {
    const { bloodGroup, latitude, longitude } = req.body;

    if (!bloodGroup || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Blood group and location are required",
      });
    }

    const existingProfile = await DonorProfile.findOne({
      userId: req.user._id,
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Donor profile already exists",
      });
    }

    const donorProfile = await DonorProfile.create({
      userId: req.user._id,
      bloodGroup,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    return res.status(201).json({
      success: true,
      message: "Donor profile created successfully",
    });
  } catch (error) {
    console.error("Create donor profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMyDonorProfile = async (req, res) => {
  try {
    const donorProfile = await DonorProfile.findOne({
      userId: req.user._id,
    });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      donorProfile,
    });
  } catch (error) {
    console.error("Get donor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateDonorAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean",
      });
    }

    const donorProfile = await DonorProfile.findOneAndUpdate(
      { userId: req.user._id },
      { isAvailable },
      { new: true },
    );

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donor availability updated successfully",
    });
  } catch (error) {
    console.error("Update donor availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { createDonorProfile, getMyDonorProfile, updateDonorAvailability };
