const express = require("express");
const {
  register,
  getAllDonors,
  getDonorsById,
  updateDonor,
} = require("../controllers/donor.controller");
const validateRequest = require("../middleware/validateRequest");
const { donorSignupValidation } = require("../validators/donorSignup.validate");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.post("/", validateRequest(donorSignupValidation), register);
router.get("/", authenticateUser, authorizePermissions("admin"), getAllDonors);

router.patch("/", authenticateUser, authorizePermissions("donor"), updateDonor);

router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  getDonorsById
);

module.exports = router;
