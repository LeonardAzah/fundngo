const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const CustomError = require("../errors");
const otpGenerator = require("otp-generator");
const { StatusCodes } = require("http-status-codes");
const sendAdminEmail = require("../utils/sendAdminEmail");
const paginate = require("../utils/paginate");
const sendApproveEmail = require("../utils/sendApprovedMail");
const sendDeclineEmail = require("../utils/sendDeclineMail ");

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

const getAllUser = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  excludeFields = "password otp";
  const users = await paginate({
    model: User,
    page,
    limit,
    excludeFields,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "donors fetched sucessfully",
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select(
    "-password -otp"
  );
  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Users fetched sucessfully",
    data: user,
  });
});

const approveVerification = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const ngo = await User.findOne({ _id: Id });
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }

  ngo.status = "approved";
  await ngo.save();

  await sendApproveEmail({
    name: ngo.name,
    email: ngo.email,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO verification approved",
  });
});

const declineVerification = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const ngo = await User.findOne({ _id: Id });
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  ngo.status = "waiting";
  await ngo.save();
  await sendDeclineEmail({
    name: ngo.name,
    email: ngo.email,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO verification declined",
  });
});

module.exports = {
  registerAdmin,
  getAllUser,
  getUserById,
  approveVerification,
  declineVerification,
};
