const asyncHandler = require("../util/asyncHandler");
const User = require("../model/User");
const CustomError = require("../error");
const otpGenerator = require("otp-generator");
const sendVerificationEmail = require("../util/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");
const createHash = require("../util/createHash");

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    phone,
    cac,
    areaOfIntrest,
    state,
    country,
  } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  if (password !== confirmPassword) {
    throw new CustomError.BadRequestError("Password  do not match");
  }
  console.log(areaOfIntrest);
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const hashedOtp = await createHash(otp);
  const user = await User.create({
    name,
    email,
    password,
    otp: hashedOtp,
    accountType: "ngo",
    phone,
    cac,
    areaOfIntrest,
    country,
    state,
    role: "ngo",
  });

  await sendVerificationEmail({
    email: user.email,
    otp: otp,
  });

  res.status(StatusCodes.CREATED).json({
    response: "Successful!",
    msg: "Please check email to verify account",
  });
});

module.exports = {
  register,
};
