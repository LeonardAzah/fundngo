const asyncHandler = require("../util/asyncHandler");
const User = require("../model/User");
const CustomError = require("../error");

const isNgoValid = asyncHandler(async (req, res, next) => {
  const { userId } = req.user;
  const ngo = await User.findById({ _id: userId });
  if (!ngo) {
    throw next(new CustomError.NotFoundError("NGO not found"));
  }

  if (ngo.status !== "approved") {
    throw next(
      new CustomError.UnauthorizedError(
        "Please complete the verification process to access resource"
      )
    );
  }
  return next();
});

module.exports = isNgoValid;
