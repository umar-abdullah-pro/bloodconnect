const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },

    units: {
      type: Number,
      required: true,
      min: 1,
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

    urgency: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "EMERGENCY"],
      default: "MEDIUM",
    },

    requiredBy: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["OPEN", "FULFILLED", "CANCELLED", "EXPIRED"],
      default: "OPEN",
    },
  },
  {
    timestamps: true,
  },
);

bloodRequestSchema.index({
  location: "2dsphere",
});

const BloodRequest = mongoose.model("BloodRequest", bloodRequestSchema);

module.exports = BloodRequest;