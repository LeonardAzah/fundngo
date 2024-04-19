const CustomError = require("../errors");

const validatePassword = (value) => {
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(value)) {
    throw new CustomError.BadRequestError(
      "Password must contain at least one capital letter"
    );
  }
  if (!/\d/.test(value)) {
    throw new CustomError.BadRequestError(
      "Password must contain at least one number"
    );
  }
  if (!/[!@#$%^&*]/.test(value)) {
    throw new CustomError.BadRequestError(
      "Password must contain at least one special character (!@#$%^&*)"
    );
  }
  return true;
};

module.exports = validatePassword;
