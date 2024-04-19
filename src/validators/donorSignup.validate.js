const { body } = require("express-validator");
const CustomError = require("../errors");
const validatePassword = require("./validatePassword");

const comparePasswords = (value, { req }) => {
  if (value !== req.body.password) {
    throw new CustomError.BadRequestError("Password  do not match");
  }
  return true;
};

const donorSignupValidation = [
  body("name").notEmpty().trim().withMessage("Name is required"),

  body("email").isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(validatePassword),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom(comparePasswords),

  body("accountType")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["corporation", "individual"])
    .withMessage("Account type must be 'corporation' or 'individual'"),
];

module.exports = { donorSignupValidation, comparePasswords };
