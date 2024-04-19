const { param } = require("express-validator");
const validateId = [param("id").isMongoId().withMessage("Invalid id")];

module.exports = validateId;
