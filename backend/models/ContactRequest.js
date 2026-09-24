const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bloodRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

contactRequestSchema.index({
  donorId: 1,
  status: 1,
});

contactRequestSchema.index({
  requesterId: 1,
  status: 1,
});

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

module.exports = ContactRequest;
