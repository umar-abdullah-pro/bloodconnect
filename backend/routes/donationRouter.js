const express = require("express");

const { createDonation, getMyDonations } = require("../controllers/donationController");
const protect = require("../middlewares/authMiddleware");

const donationRouter = express.Router();

donationRouter.post("/", protect, createDonation)
donationRouter.get("/me", protect, getMyDonations)

module.exports = donationRouter;