const { validationResult } = require("express-validator");

const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const response = errors.array().map((error) => {
      return {
        type: error.param,
        msg: error.msg,
        code: 400,
      };
    });
    res.status(400).json({ response: "errors", errors: response });
  };
};

module.exports = validateRequest;
