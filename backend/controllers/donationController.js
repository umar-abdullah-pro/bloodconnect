const Donation = require("../models/Donation");

const createDonation = async (req, res) => {
  try {
    const { donationDate, bloodBank } = req.body;

    // 1. Check required field
    if (!donationDate) {
      return res.status(400).json({
        success: false,
        message: "Donation date is required",
      });
    }

    // 2. Validate donation date
    const date = new Date(donationDate);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid donation date",
      });
    }

    // 3. Prevent future donation dates
    if (date > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Donation date cannot be in the future",
      });
    }

    // 4. Create donation
    await Donation.create({
      donorId: req.user._id,
      donationDate: date,
      bloodBank: bloodBank?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Donation record created successfully",
    });
  } catch (error) {
    console.error("Create donation error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id,
    }).sort({
      donationDate: -1,
    });

    return res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Get donations error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { createDonation, getMyDonations };
