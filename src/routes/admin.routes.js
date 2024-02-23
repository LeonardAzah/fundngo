const express = require("express");
const { registerAdmin } = require("../controller/admin.controller");
const validateRequest = require("../middleware/validateRequest");
const { adminSignupValidation } = require("../validators/adminSignup.validate");
const router = express.Router();

router.post("/", validateRequest(adminSignupValidation), registerAdmin);

module.exports = router;
