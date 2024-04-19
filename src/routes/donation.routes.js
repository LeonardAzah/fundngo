const express = require("express");
const donationController = require("../controllers/donation.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const validateId = require("../validators/Id.validate");
const { donationValidate } = require("../validators/donation.validate");

const router = express.Router();

router.get(
  "/donors",
  authenticateUser,
  authorizePermissions("admin"),
  donationController.getAllDonations
);
router.get(
  "/all",
  authenticateUser,
  authorizePermissions("ngo"),
  donationController.getAllMyDonations
);

router.post(
  "/:id",
  validateRequest(validateId),
  validateRequest(donationValidate),
  donationController.createDonation
);

router.post("/", donationController.verifyTrans);
router.get(
  "/ngo/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("admin"),
  donationController.getDonationsByNgoId
);

router.get(
  "/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("admin", "ngo"),
  donationController.getDonationById
);

module.exports = router;
