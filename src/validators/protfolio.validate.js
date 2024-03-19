const { body, param } = require("express-validator");

const createProtfolioValidation = [
  body("mission")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Mission is required"),
  body("vision").trim().notEmpty().isString().withMessage("Vision is required"),
  body("overview")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("Overview is required"),
  body("project").optional().isArray(),
  body("url").optional().trim().isString(),
];
const getProtfolioByIdValidation = [
  param("id").isString().notEmpty().withMessage("profile id is required"),
];

module.exports = {
  createProtfolioValidation,
  getProtfolioByIdValidation,
};
