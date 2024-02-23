const express = require("express");
const { registerAdmin } = require("../controller/admin.controller");
const router = express.Router();

router.post("/", registerAdmin);

module.exports = router;
