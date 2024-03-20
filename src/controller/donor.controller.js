const asyncHandler = require("../util/asyncHandler");
const User = require("../model/User");
const CustomError = require("../error");
const otpGenerator = require("otp-generator");
const sendVerificationEmail = require("../util/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");
const createHash = require("../util/createHash");
const paginate = require("../util/paginate");

const register = asyncHandler(async (req, res) => {
  const { accountType, name, email, password, confirmPassword } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  if (password !== confirmPassword) {
    throw new CustomError.BadRequestError("Password  do not match");
  }

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
    accountType,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    otp: otp,
  });

  res.status(StatusCodes.CREATED).json({
    response: "Successful!",
    msg: "Please check email to verify account",
  });
});

const getAllDonors = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filters = { role: "donor" };
  excludeFields =
    "password otp passwordTokenExpirationDate areaOfIntrest documents";
  const donors = await paginate({
    model: User,
    page,
    limit,
    filters,
    excludeFields,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "donors fetched sucessfully",
    data: donors,
  });
});

const getDonorsById = asyncHandler(async (req, res) => {
  const donor = await User.findOne({ _id: req.params.id }).select(
    "-password -otp -documents -areaOfIntrest"
  );
  if (!donor) {
    throw new CustomError.NotFoundError("Donor not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donors fetched sucessfully",
    data: donor,
  });
});

const updateDonor = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const donor = await User.findOne({ _id: userId });
  if (!donor) {
    throw new CustomError.NotFoundError("Donor not found");
  }

  delete req.body.email;

  const donorUpdated = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    select: "-password",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donor updated sucessfully",
    data: donorUpdated,
  });
});

module.exports = {
  register,
  getAllDonors,
  getDonorsById,
  updateDonor,
};
