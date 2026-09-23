const express = require("express");

const { registerUser, loginUser, getCurrentUser } =  require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getCurrentUser);

module.exports = authRouter;