const express = require("express");
const {
  registerAdmin,
  getAllUser,
  getUserById,
  approveVerification,
  declineVerification,
} = require("../controllers/admin.controller");
const validateRequest = require("../middleware/validateRequest");
const { adminSignupValidation } = require("../validators/adminSignup.validate");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const validateId = require("../validators/Id.validate");
const router = express.Router();

router.post("/", validateRequest(adminSignupValidation), registerAdmin);

router.get("/", authenticateUser, authorizePermissions("admin"), getAllUser);

router.patch(
  "/ngo-approved/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("admin"),
  approveVerification
);

router.post(
  "/ngo-declined/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("admin"),
  declineVerification
);

router.get(
  "/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("admin"),
  getUserById
);

module.exports = router;
