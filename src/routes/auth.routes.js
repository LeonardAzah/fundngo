const express = require("express");
const passport = require("passport");
const {
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  googleCallback,
  changePassword,
} = require("../controller/auth.controller");
const { authenticateUser } = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const {
  loginValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("../validators/auth.validate");
const router = express.Router();

router.post("/login", validateRequest(loginValidation), login);
router.post(
  "/verify-email",
  validateRequest(verifyEmailValidation),
  verifyEmail
);
router.delete("/logout", authenticateUser, logout);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidation),
  forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordValidation),
  resetPassword
);

router.post("/change-password", authenticateUser, changePassword);
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
