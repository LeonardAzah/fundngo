const express = require("express");
const passport = require("passport");
const {
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  googleCallback,
} = require("../controller/auth.controller");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.delete("/logout", authenticateUser, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

module.exports = router;
