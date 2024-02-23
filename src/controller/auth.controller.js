const User = require("../model/User");
const asyncHandler = require("../util/asyncHandler");
const CustomError = require("../error");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const createTokenUser = require("../util/createTokenUser");
const Token = require("../model/Token");
const { attachCookiesToResponse } = require("../util/jwt");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");
const sendResetPasswordEmail = require("../util/sendResetPasswordEmail");
const createHash = require("../util/createHash");

const verifyEmail = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }
  isOtpValid = await bcrypt.compare(otp, user.otp);

  if (!isOtpValid) {
    throw new CustomError.UnauthenticatedError("Verification Failed");
  }
  user.isValidated = true;
  user.isVerified = true;
  user.verified = Date.now();
  user.otp = "";

  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ response: "Successful", msg: "Email verified" });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = "";

  //check for existing tokens
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
});

const logout = asyncHandler(async (req, res) => {
  await Token.findOneAndDelete({ user: req.user.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordOtp = await createHash(otp);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      otp: otp,
    });
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password code" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { otp, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new CustomError.BadRequestError("Password  do not match");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();
    const isOtpValid = await bcrypt.compare(otp, user.passwordOtp);

    if (isOtpValid && user.passwordTokenExpirationDate > currentDate) {
      user.password = password;
      user.passwordOtp = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "Password Resetted!" });
});

const googleCallback = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = "";

  //check for existing tokens
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
});

module.exports = {
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleCallback,
};
