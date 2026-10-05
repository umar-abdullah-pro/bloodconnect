const DonorProfile = require("../models/DonorProfile");

const createDonorProfile = async (req, res) => {
  try {
    const {
      bloodGroup,
      latitude,
      longitude,
      locationName,
    } = req.body;

    // 1. Check required fields
    if (
      !bloodGroup ||
      latitude === undefined ||
      longitude === undefined ||
      !locationName
    ) {
      return res.status(400).json({
        success: false,
        message: "Blood group and location are required",
      });
    }

    // 2. Validate blood group
    const validBloodGroups = [
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
    ];

    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood group",
      });
    }

    // 3. Validate coordinates
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location coordinates",
      });
    }

    // 4. Validate location name
    if (locationName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Location name must be at least 2 characters",
      });
    }

    // 5. Check existing profile
    const existingProfile = await DonorProfile.findOne({
      userId: req.user._id,
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Donor profile already exists",
      });
    }

    // 6. Create profile
    await DonorProfile.create({
      userId: req.user._id,
      bloodGroup,
      locationName: locationName.trim(),
      location: {
        type: "Point",
        coordinates: [lng, lat],
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
