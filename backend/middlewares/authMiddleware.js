const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Check if session exists
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }
    // Find user associated with the session
    const user = await User.findById(req.session.userId).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

module.exports = protect;