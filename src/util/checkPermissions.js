const CustomError = require("../error");

const checkPermissions = (requestUser, resourseUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser._id !== resourseUserId.toString()) return;
  throw new CustomError.UnauthorizedError("Unauthorized to access resource");
};

module.exports = checkPermissions;
