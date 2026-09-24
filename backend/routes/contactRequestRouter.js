const express = require("express");

const { createContactRequest, getMyContactRequests, updateContactRequestStatus, getAcceptedContact } = require("../controllers/contactRequestController");
const protect = require("../middlewares/authMiddleware");

const contactRequestRouter = express.Router();

contactRequestRouter.post("/", protect, createContactRequest);
contactRequestRouter.get("/me", protect, getMyContactRequests);
contactRequestRouter.patch("/:requestId", protect, updateContactRequestStatus);
contactRequestRouter.get("/:requestId/contact", protect, getAcceptedContact);
module.exports = contactRequestRouter;
