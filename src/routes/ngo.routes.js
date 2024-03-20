const express = require("express");
const {
  register,
  uploadDocuments,
  getAllNgos,
  getAllVerifiedNgos,
  updateNgo,
  getNgoById,
} = require("../controller/ngo.controller");
const validateRequest = require("../middleware/validateRequest");
const { ngoSignupValidation } = require("../validators/ngoSignup.validate");
const { uploadWithPdf } = require("../config/multer");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.post(
  "/",
  // validateRequest(ngoSignupValidation),
  register
);
router.post("/documents", uploadWithPdf.array("files", 2), uploadDocuments);
router.get("/", authenticateUser, authorizePermissions("admin"), getAllNgos);
router.get("/all", getAllVerifiedNgos);
router.patch("/", authenticateUser, updateNgo);
router.get("/:id", authenticateUser, authorizePermissions("admin"), getNgoById);

module.exports = router;
