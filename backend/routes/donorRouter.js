const express = require("express");

const { createDonorProfile, getMyDonorProfile, updateDonorAvailability } = require("../controllers/donorController");
const protect  = require("../middlewares/authMiddleware");

const donorRouter = express.Router();

donorRouter.post("/", protect, createDonorProfile);
donorRouter.get("/me", protect, getMyDonorProfile);
donorRouter.patch("/availability", protect, updateDonorAvailability);

module.exports = donorRouter;