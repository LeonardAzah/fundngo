const asyncHandler = require("../util/asyncHandler");
const User = require("../model/User");
const CustomError = require("../error");
const otpGenerator = require("otp-generator");
const { StatusCodes } = require("http-status-codes");
const sendAdminEmail = require("../util/sendAdminEmail");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  const otp = otpGenerator.generate(8, {
    upperCaseAlphabets: true,
    lowerCaseAlphabets: true,
    specialChars: false,
  });
  const user = await User.create({
    name,
    password: otp,
    email,
    role: "admin",
    isVerified: true,
    isValidated: true,
  });

  await sendAdminEmail({
    name: user.name,
    email: user.email,
    otp: otp,
  });

  res.status(StatusCodes.CREATED).json({
    response: "Successful!",
    msg: "Please check your email and login",
  });
});

module.exports = {
  registerAdmin,
};
