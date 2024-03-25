const CustomError = require("../error");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser._id !== resourceUserId) {
    throw new CustomError.UnauthorizedError("Unauthorized to access resource");
  }
};

module.exports = checkPermissions;
