const express = require("express");

const { createBloodRequest, getMyBloodRequests } = require("../controllers/bloodrRequestController");
const protect = require("../middlewares/authMiddleware");

const bloodRequestRouter = express.Router();

bloodRequestRouter.post("/", protect, createBloodRequest);
bloodRequestRouter.get("/my-requests", protect, getMyBloodRequests);

module.exports = bloodRequestRouter;