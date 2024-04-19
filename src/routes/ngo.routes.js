const express = require("express");
const {
  register,
  uploadDocuments,
  getAllNgos,
  getAllVerifiedNgos,
  updateNgo,
  getNgoById,
  viewNgoById,
} = require("../controllers/ngo.controller");
const validateRequest = require("../middleware/validateRequest");
const { ngoSignupValidation } = require("../validators/ngoSignup.validate");
const { uploadWithPdf } = require("../config/multer");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const validateId = require("../validators/Id.validate");
const router = express.Router();

router.post("/", validateRequest(ngoSignupValidation), register);
router.post("/documents", uploadWithPdf.array("files", 2), uploadDocuments);
router.get("/", authenticateUser, authorizePermissions("admin"), getAllNgos);
router.get("/all", getAllVerifiedNgos);
router.patch("/", authenticateUser, updateNgo);
router.get("/view/:id", validateRequest(validateId), viewNgoById);
router.get("/:id", validateRequest(validateId), getNgoById);

module.exports = router;
