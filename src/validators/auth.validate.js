const { body } = require("express-validator");
const validatePassword = require("./validatePassword");
const { comparePasswords } = require("./donorSignup.validate");

const loginValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const verifyEmailValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6 })
    .withMessage("OTP must be at least 6 characters long"),
  ,
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email"),
];

const resetPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .custom(validatePassword),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom(comparePasswords),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6 })
    .withMessage("OTP must be at least 6 characters long"),
  ,
];

const changePasswordValidation = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("password")
    .notEmpty()
    .withMessage("new password is required")
    .custom(validatePassword),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom(comparePasswords),
];

module.exports = {
  loginValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
};
