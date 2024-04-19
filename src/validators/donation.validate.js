const { body } = require("express-validator");

const donationValidate = [
  body("email").isEmail().withMessage("Invalid email"),
  body("amount").notEmpty().isNumeric().withMessage("Amount is required"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

module.exports = { donationValidate };
