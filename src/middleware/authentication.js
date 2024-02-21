const CustomError = require("../error");
const Token = require("../model/Token");
const { isTokenValid } = require("../util/jwt");
const { attachCookiesToResponse } = require("../util/jwt");
const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw next(
        new CustomError.UnauthenticatedError("Authentication Invalid")
      );
    }
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    throw next(new CustomError.UnauthenticatedError("Authentication Invalid"));
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw next(
        new CustomError.UnauthorizedError("Unauthorized to access this route")
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
