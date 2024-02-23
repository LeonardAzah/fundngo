const express = require("express");
const { register } = require("../controller/donor.controller");
const validateRequest = require("../middleware/validateRequest");
const { donorSignupValidation } = require("../validators/donorSignup.validate");
const router = express.Router();

router.post("/", validateRequest(donorSignupValidation), register);

module.exports = router;
