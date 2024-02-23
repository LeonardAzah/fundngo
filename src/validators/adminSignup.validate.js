const { body } = require("express-validator");

const adminSignupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Invalid email"),
];

module.exports = adminSignupValidation;
