const ContactRequest = require("../models/ContactRequest");
const BloodRequest = require("../models/BloodRequest");
const DonorProfile = require("../models/DonorProfile");
const { isBloodCompatible } = require("../utils/bloodCompatibility");
const mongoose = require("mongoose");


const createContactRequest = async (req, res) => {
  try {
    // 1. Verify authenticated user
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { donorId, bloodRequestId } = req.body;

    // 2. Validate required fields
    if (!donorId || !bloodRequestId) {
      return res.status(400).json({
        success: false,
        message: "Donor ID and blood request ID are required",
      });
    }

    // 3. Validate MongoDB IDs
    if (
      !mongoose.isValidObjectId(donorId) ||
      !mongoose.isValidObjectId(bloodRequestId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid donor ID or blood request ID",
      });
    }

    // 4. Find blood request owned by the logged-in user
    const bloodRequest = await BloodRequest.findOne({
      _id: bloodRequestId,
      requesterId: req.user._id,
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 5. Check request status
    if (bloodRequest.status !== "OPEN") {
      return res.status(400).json({
        success: false,
        message: "Blood request is not open",
      });
    }

    // 6. Check expiry
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

    // 7. Find available donor
    const donor = await DonorProfile.findOne({
      _id: donorId,
      isAvailable: true,
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: "Donor not available",
      });
    }

    // 8. Prevent contacting yourself
    if (donor.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot contact yourself",
      });
    }

    // 9. Verify blood compatibility
    if (!isBloodCompatible(donor.bloodGroup, bloodRequest.bloodGroup)) {
      return res.status(400).json({
        success: false,
        message: "Donor is not compatible with this blood request",
      });
    }

    // 10. Prevent duplicate pending requests
    const existingRequest = await ContactRequest.findOne({
      requesterId: req.user._id,
      donorId: donor.userId,
      bloodRequestId: bloodRequest._id,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Contact request already sent",
      });
    }

    // 11. Create contact request
    await ContactRequest.create({
      requesterId: req.user._id,
      donorId: donor.userId,
      bloodRequestId: bloodRequest._id,
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Contact request sent successfully",
    });
  } catch (error) {
    // Handle duplicate-key errors if a matching unique index exists
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Contact request already exists",
      });
    }

    console.error("Create contact request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMyContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({
      donorId: req.user._id,
      status: { $in: ["PENDING", "ACCEPTED"] },
    })
      .populate("requesterId", "name")
      .populate("bloodRequestId", "bloodGroup units urgency");

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get contact requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateContactRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { requestId } = req.params;

    // 1. Validate request ID
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact request ID",
      });
    }

    // 2. Validate status
    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // 3. Find pending request belonging to logged-in donor
    const contactRequest = await ContactRequest.findOne({
      _id: requestId,
      donorId: req.user._id,
      status: "PENDING",
    });

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found",
      });
    }

    // 4. Update status
    contactRequest.status = status;

    await contactRequest.save();

    return res.status(200).json({
      success: true,
      message: `Contact request ${status.toLowerCase()} successfully`,
    });
  } catch (error) {
    console.error("Update contact request error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAcceptedContact = async (req, res) => {
  try {
    const { requestId } = req.params;

    // 1. Validate request ID
    if (!mongoose.isValidObjectId(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact request ID",
      });
    }

    // 2. Find accepted request belonging to requester
    const contactRequest = await ContactRequest.findOne({
      _id: requestId,
      requesterId: req.user._id,
      status: "ACCEPTED",
    }).populate("donorId", "name phone");

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: "Accepted contact request not found",
      });
    }

    return res.status(200).json({
      success: true,
      contact: {
        name: contactRequest.donorId.name,
        phone: contactRequest.donorId.phone,
      },
    });
  } catch (error) {
    console.error("Get accepted contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMyContacts = async (req, res) => {
  try {
    const contacts = await ContactRequest.find({
      requesterId: req.user._id,
      status: "ACCEPTED",
    }).populate("bloodRequestId", "bloodGroup units urgency");

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get my contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getMySentContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({
      requesterId: req.user._id,
      status: { $in: ["PENDING", "ACCEPTED", "REJECTED"] },
    })
      .populate("donorId", "name")
      .populate("bloodRequestId", "bloodGroup units urgency");

    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get sent contact requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  createContactRequest,
  getMyContactRequests,
  updateContactRequestStatus,
  getMySentContactRequests,
  getAcceptedContact,
  getMyContacts,
};
