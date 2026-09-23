const express = require("express");

const { createDonorProfile, getMyDonorProfile } = require("../controllers/donorController");
const protect  = require("../middlewares/authMiddleware");

const donorRouter = express.Router();

donorRouter.post("/", protect, createDonorProfile);
donorRouter.get("/me", protect, getMyDonorProfile);  

module.exports = donorRouter;