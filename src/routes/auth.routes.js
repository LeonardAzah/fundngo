const express = require("express");
const {
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/logout", authenticateUser, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
