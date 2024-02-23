const express = require("express");
const { register } = require("../controller/ngo.controller");
const router = express.Router();

router.post("/", register);

module.exports = router;
