const ContactRequest = require("../models/ContactRequest");
const BloodRequest = require("../models/BloodRequest");
const DonorProfile = require("../models/DonorProfile");
const mongoose = require("mongoose");

const mongoose = require("mongoose");

const createContactRequest = async (req, res) => {
  try {
    const { donorId, bloodRequestId } = req.body;

    // 1. Check required fields
    if (!donorId || !bloodRequestId) {
      return res.status(400).json({
        success: false,
        message: "Donor ID and blood request ID are required",
      });
    }

    // 2. Validate MongoDB IDs
    if (
      !mongoose.isValidObjectId(donorId) ||
      !mongoose.isValidObjectId(bloodRequestId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid donor ID or blood request ID",
      });
    }

    // 3. Verify blood request belongs to requester
    const bloodRequest = await BloodRequest.findOne({
      _id: bloodRequestId,
      requesterId: req.user._id,
      status: "OPEN",
    });

    if (!bloodRequest) {
      return res.status(404).json({
        success: false,
        message: "Blood request not found",
      });
    }

    // 4. Verify donor exists and is available
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

    // 5. Prevent contacting yourself
    if (donor.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot contact yourself",
      });
    }

    // 6. Prevent duplicate pending request
    const existingRequest = await ContactRequest.findOne({
      requesterId: req.user._id,
      donorId: donor.userId,
      bloodRequestId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Contact request already sent",
      });
    }

    // 7. Create contact request
    await ContactRequest.create({
      requesterId: req.user._id,
      donorId: donor.userId,
      bloodRequestId,
    });

    return res.status(201).json({
      success: true,
      message: "Contact request sent successfully",
    });
  } catch (error) {
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
