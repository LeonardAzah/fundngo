const express = require("express");
const { register } = require("../controller/donor.controller");
const router = express.Router();

router.post("/", register);

module.exports = router;
