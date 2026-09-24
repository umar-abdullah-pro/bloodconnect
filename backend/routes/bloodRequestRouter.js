const express = require("express");

const {
  createBloodRequest,
  getMyBloodRequests,
  getMatchingDonors,
  updateBloodRequestStatus,
} = require("../controllers/bloodRequestController");
const protect = require("../middlewares/authMiddleware");

const bloodRequestRouter = express.Router();

bloodRequestRouter.post("/", protect, createBloodRequest);
bloodRequestRouter.get("/my-requests", protect, getMyBloodRequests);
bloodRequestRouter.get("/:requestId/matches", protect, getMatchingDonors);
bloodRequestRouter.patch("/:requestId/status", protect, updateBloodRequestStatus);

module.exports = bloodRequestRouter;
