const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    donationDate: {
      type: Date,
      required: true,
    },

    bloodBank: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

donationSchema.index({
  donorId: 1,
  donationDate: -1,
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
