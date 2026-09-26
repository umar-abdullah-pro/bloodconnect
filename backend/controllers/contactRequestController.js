const ContactRequest = require("../models/ContactRequest");
const BloodRequest = require("../models/BloodRequest");
const DonorProfile = require("../models/DonorProfile");

const createContactRequest = async (req, res) => {
  try {
    const { donorId, bloodRequestId } = req.body;

    if (!donorId || !bloodRequestId) {
      return res.status(400).json({
        success: false,
        message: "Donor ID and blood request ID are required",
      });
    }

    // Verify blood request belongs to requester
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

    // Verify donor exists and is available
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

    // Prevent contacting yourself
    if (donor.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot contact yourself",
      });
    }

    // Prevent duplicate pending request
    const existingRequest = await ContactRequest.findOne({
      requesterId: req.user._id,
      donorId,
      bloodRequestId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "Contact request already sent",
      });
    }

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

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const contactRequest = await ContactRequest.findOne({
      _id: req.params.requestId,
      donorId: req.user._id,
      status: "PENDING",
    });

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        message: "Contact request not found",
      });
    }

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
    const contactRequest = await ContactRequest.findOne({
      _id: req.params.requestId,
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

module.exports = {
  createContactRequest,
  getMyContactRequests,
  updateContactRequestStatus,
  getAcceptedContact,
  getMyContacts,
};
