const { body } = require("express-validator");
const { comparePasswords } = require("./donorSignup.validate");

const ngoSignupValidation = [
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

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("cac").trim().notEmpty().withMessage("CAC number is required"),

  body("areaOfIntrest").notEmpty().withMessage("Password is required"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("country").trim().notEmpty().withMessage("Country is required"),
];

module.exports = ngoSignupValidation;
