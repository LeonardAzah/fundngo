const { body } = require("express-validator");

const paymentDetailValidate = [
  body("accountName").trim().notEmpty().withMessage("Account name is required"),
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Account number must be exactly 10 characters"),
  body("bankName").trim().notEmpty().withMessage("Bank name is required"),
];

module.exports = { paymentDetailValidate };
