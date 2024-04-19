const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const Account = require("../models/Account");
const CustomError = require("../errors");
const otpGenerator = require("otp-generator");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const { StatusCodes } = require("http-status-codes");
const createHash = require("../utils/createHash");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const paginate = require("../utils/paginate");
const path = require("path");

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
  await Account.create({
    ngo: user._id,
  });
  await await sendVerificationEmail({
    email: user.email,
    otp: otp,
  });

  res.status(StatusCodes.CREATED).json({
    response: "Successful!",
    msg: "Please check email to verify account",
  });
});

const uploadDocuments = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const urls = [];
  const files = req.files;

  if (!files) {
    throw new CustomError.BadRequestError("Files required");
  }

  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "image(s) uploaded sucessfully",
    data: urls,
  });
});

const getAllNgos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filters = { accountType: "ngo" };
  excludeFields = "password otp passwordTokenExpirationDate";

  const populateOptions = [
    {
      model: "Payment",
      path: "payment",
      select: "accountName accountNumber bankName",
    },
  ];
  const ngos = await paginate({
    model: User,
    page,
    limit,
    filters,
    excludeFields,
    populateOptions,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO's fetched sucessfully",
    data: ngos,
  });
});
const getAllVerifiedNgos = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const filters = { accountType: "ngo", status: "approved" };
  const selectFields =
    "name email accountType phone country state areaOfIntrest";
  const ngos = await paginate({
    model: User,
    page,
    limit,
    filters,
    selectFields,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO's fetched sucessfully",
    data: ngos,
  });
});

const getNgoById = asyncHandler(async (req, res) => {
  const ngo = await User.findOne({ _id: req.params.id }).select("-password");
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO fetched sucessfully",
    data: ngo,
  });
});
const viewNgoById = asyncHandler(async (req, res) => {
  const ngo = await User.findById(req.params.id)
    .select("-password -documents -passwordTokenExpirationDate -passwordOtp")
    .populate({
      path: "portfolio",
      select: "mission vision overview projects url images ",
    });
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO fetched sucessfully",
    data: ngo,
  });
});

const updateNgo = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const ngo = await User.findOne({ _id: userId });
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }

  delete req.body.email;
  delete req.body.cac;

  const ngoUpdated = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    select: "-password",
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "NGO updated sucessfully",
    data: ngoUpdated,
  });
});

module.exports = {
  register,
  uploadDocuments,
  getAllNgos,
  getAllVerifiedNgos,
  updateNgo,
  getNgoById,
  viewNgoById,
};
