const BloodRequest = require("../models/BloodRequest");
const ContactRequest = require("../models/ContactRequest");

const { findMatchingDonors } = require("../services/matchingService");

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

    if (!["FULFILLED", "CANCELLED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const bloodRequest = await BloodRequest.findOne({
      _id: req.params.requestId,
      requesterId: req.user._id,
      status: "OPEN",
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Open blood request not found",
      });
    }

    // A request can be fulfilled only after
    // a donor has accepted the contact request.
    if (status === "FULFILLED") {
      const acceptedContact = await ContactRequest.findOne({
        bloodRequestId: bloodRequest._id,
        status: "ACCEPTED",
      });

      if (!acceptedContact) {
        return res.status(400).json({
          success: false,
          message: "Blood request cannot be fulfilled before donor acceptance",
        });
      }
    }

    bloodRequest.status = status;

    await bloodRequest.save();

    if (["FULFILLED", "CANCELLED"].includes(status)) {
      await ContactRequest.updateMany(
        {
          bloodRequestId: bloodRequest._id,
          status: "PENDING",
        },
        {
          status: "CANCELLED",
        },
      );
    }

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
