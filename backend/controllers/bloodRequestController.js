const BloodRequest = require("../models/BloodRequest");
const ContactRequest = require("../models/ContactRequest");
const mongoose = require("mongoose");

const { findMatchingDonors } = require("../services/matchingService");

const createBloodRequest = async (req, res) => {
  try {
    const {
      bloodGroup,
      units,
      latitude,
      longitude,
      urgency,
      requiredBy,
    } = req.body;

    // 1. Required fields
    if (
      !bloodGroup ||
      units === undefined ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Blood group, units and location are required",
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

    // 3. Validate units
    const requestUnits = Number(units);

    if (!Number.isInteger(requestUnits) || requestUnits < 1) {
      return res.status(400).json({
        success: false,
        message: "Units must be a positive integer",
      });
    }

    // 4. Validate coordinates
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

    // 5. Validate urgency
    const validUrgencies = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "EMERGENCY",
    ];

    if (urgency && !validUrgencies.includes(urgency)) {
      return res.status(400).json({
        success: false,
        message: "Invalid urgency",
      });
    }

    // 6. Validate requiredBy
    let requestRequiredBy;

    if (requiredBy) {
      requestRequiredBy = new Date(requiredBy);

      if (Number.isNaN(requestRequiredBy.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid required date",
        });
      }

      if (requestRequiredBy <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Required date must be in the future",
        });
      }
    }

    // 7. Create blood request
    await BloodRequest.create({
      requesterId: req.user._id,
      bloodGroup,
      units: requestUnits,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
      urgency,
      requiredBy: requestRequiredBy,
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

const getMatchingDonors = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findOne({
      _id: req.params.requestId,
      requesterId: req.user._id,
      status: "OPEN",
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // Check if blood request has expired
    if (
      bloodRequest.requiredBy &&
      new Date(bloodRequest.requiredBy) <= new Date()
    ) {
      bloodRequest.status = "EXPIRED";

      await bloodRequest.save();

      return res.status(400).json({
        success: false,
        message: "Blood request has expired",
      });
    }

    const [longitude, latitude] = bloodRequest.location.coordinates;

    const donors = await findMatchingDonors(
      bloodRequest.bloodGroup,
      latitude,
      longitude,
    );

    return res.status(200).json({
      success: true,
      donors,
    });
  } catch (error) {
    console.error("Get matching donors error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateBloodRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { requestId } = req.params;

    // 1. Validate request ID
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blood request ID",
      });
    }

    // 2. Validate status
    if (!["FULFILLED", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // 3. Find user's open request
    const bloodRequest = await BloodRequest.findOne({
      _id: requestId,
      requesterId: req.user._id,
      status: "OPEN",
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Open blood request not found",
      });
    }

    // 4. Fulfil only after donor acceptance
    if (status === "FULFILLED") {
      const acceptedContact = await ContactRequest.findOne({
        bloodRequestId: bloodRequest._id,
        status: "ACCEPTED",
      });

      if (!acceptedContact) {
        return res.status(400).json({
          success: false,
          message:
            "Blood request cannot be fulfilled before donor acceptance",
        });
      }
    }

    // 5. Update status
    bloodRequest.status = status;

    await bloodRequest.save();

    // 6. Cancel remaining pending contact requests
    await ContactRequest.updateMany(
      {
        bloodRequestId: bloodRequest._id,
        status: "PENDING",
      },
      {
        status: "CANCELLED",
      },
    );

    return res.status(200).json({
      success: true,
      message: `Blood request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Update blood request status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createBloodRequest,
  getMyBloodRequests,
  getMatchingDonors,
  updateBloodRequestStatus,
};
