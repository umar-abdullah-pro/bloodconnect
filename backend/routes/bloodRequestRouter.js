const express = require("express");

const { createBloodRequest, getMyBloodRequests, getMatchingDonors } = require("../controllers/bloodRequestController");
const protect = require("../middlewares/authMiddleware");

const bloodRequestRouter = express.Router();

bloodRequestRouter.post("/", protect, createBloodRequest);
bloodRequestRouter.get("/my-requests", protect, getMyBloodRequests);
bloodRequestRouter.get("/:requestId/matches", protect, getMatchingDonors);


module.exports = bloodRequestRouter;