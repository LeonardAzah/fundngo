const express = require("express");
const { register } = require("../controller/ngo.controller");
const validateRequest = require("../middleware/validateRequest");
const { ngoSignupValidation } = require("../validators/ngoSignup.validate");
const router = express.Router();

router.post("/", validateRequest(ngoSignupValidation), register);

module.exports = router;
