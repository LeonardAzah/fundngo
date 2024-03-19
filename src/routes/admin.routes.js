const express = require("express");
const {
  registerAdmin,
  getAllUser,
  getUserById,
  approveVerification,
  declineVerification,
} = require("../controller/admin.controller");
const validateRequest = require("../middleware/validateRequest");
const { adminSignupValidation } = require("../validators/adminSignup.validate");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.post(
  "/",
  // validateRequest(adminSignupValidation),
  registerAdmin
);

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUser);

router.patch(
  "/ngo-approved/:id",
  authenticateUser,
  authorizePermissions("admin"),
  approveVerification
);

router.post(
  "/ngo-declined/:id",
  authenticateUser,
  authorizePermissions("admin"),
  declineVerification
);

router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getUserById
);

module.exports = router;
