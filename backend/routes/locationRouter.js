const express = require("express");

const protect = require("../middlewares/authMiddleware");
const {
  searchLocation,
  reverseSearchLocation,
} = require("../controllers/locationController");

const locationRouter = express.Router();

locationRouter.post("/search", protect, searchLocation);
locationRouter.post("/reverse", protect, reverseSearchLocation);

module.exports = locationRouter;
