const { body } = require("express-validator");

const createProfileValidation = [
  body("mission").trim().notEmpty().withMessage("Mission is required"),
  body("vision").trim().notEmpty().withMessage("Vision is required"),
  body("overview").trim().notEmpty().withMessage("Overview is required"),
  body("project").trim().empty().withMessage("Overview is required"),
];

module.exports = {
  createProfileValidation,
};
