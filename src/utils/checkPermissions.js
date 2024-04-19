const CustomError = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser !== resourceUserId.toSting()) {
    throw new CustomError.UnauthorizedError("Unauthorized to access resource");
  }
};

module.exports = checkPermissions;
