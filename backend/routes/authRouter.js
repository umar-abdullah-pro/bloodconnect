const express = require("express");

const { registerUser, loginUser, getCurrentUser, logoutUser } =  require("../controllers/authController");

const protect = require("../middlewares/authMiddleware");

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/me", protect, getCurrentUser);
authRouter.post("/logout", protect, logoutUser);

module.exports = authRouter;