const mongoose = require("mongoose");

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

donorProfileSchema.index({
  location: "2dsphere",
});

const DonorProfile = mongoose.model("DonorProfile", donorProfileSchema);

module.exports = DonorProfile;
