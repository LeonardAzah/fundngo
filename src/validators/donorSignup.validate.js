const { body } = require("express-validator");
const CustomError = require("../error");

const comparePasswords = (value, { req }) => {
  if (value !== req.body.confirmPassword) {
    throw new CustomError.BadRequestError("Password  do not match");
  }
  return true;
};

const donorSignupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("email").isEmail().withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

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
