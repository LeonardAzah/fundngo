const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler");

const validateRequest = (validations) => {
  return asyncHandler(async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const response = errors.array().map((error) => ({
      type: error.param,
      message: error.msg,
      statusCode: 400,
    }));
    res.status(400).json({ success: false, errors: response });
  });
};

module.exports = validateRequest;
