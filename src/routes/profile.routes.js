const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const profileController = require("../controller/profile.controller");
const uploads = require("../config/multer");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/",
  uploads.array("files", 10),
  authenticateUser,
  authorizePermissions("ngo"),
  profileController.createProfile
);

router.get("/", profileController.getAllProfiles);

router.patch(
  "/i:d",
  uploads.array("files", 10),
  authenticateUser,
  authorizePermissions("ngo"),
  profileController.updateProfile
);

router.get(
  "/me",
  authenticateUser,
  authorizePermissions("ngo"),
  profileController.getAllProfiles
);
router.delete(
  authenticateUser,
  authorizePermissions("ngo"),
  profileController.deleteProfile
);
router.get("/:id", profileController.getAllProfiles);

module.exports = router;
