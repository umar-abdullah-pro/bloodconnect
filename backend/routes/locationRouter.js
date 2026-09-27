const express = require("express");

const protect = require("../middlewares/authMiddleware");
const { searchLocation } = require("../controllers/locationController");

const locationRouter = express.Router();

locationRouter.post("/search", protect, searchLocation);

module.exports = locationRouter;