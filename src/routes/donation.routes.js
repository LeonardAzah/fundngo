const express = require("express");
const donationController = require("../controller/donation.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router.post("/", donationController.createDonation);
router.get(
  "/donors",
  authenticateUser,
  authorizePermissions(["admin", "ngo"]),
  donationController.getAllDonations
);
router.get(
  "/all",
  authenticateUser,
  authorizePermissions(["admin", "ngo"]),
  donationController.getAllMyDonations
);
router.get(
  "/:id",
  authenticateUser,
  authorizePermissions(["admin", "ngo"]),
  donationController.getDonationaByProjectId
);

router.get(
  "/:id",
  authenticateUser,
  authorizePermissions(["admin", "ngo"]),
  donationController.getDonationById
);

module.exports = router;
