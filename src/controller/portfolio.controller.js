const Portfolio = require("../model/Portfolio");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const createPortfolio = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const urls = [];
  const files = req.files;

  if (files) {
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.url);
      fs.unlinkSync(path);
    }

    req.body.images = urls;
  }

  const userId = req.user.userId;
  req.body.user = userId;

  const portfolio = new Portfolio(req.body);
  await portfolio.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Portfolio created sucessfully",
    data: portfolio,
  });
});

const getAllPortfolios = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const portfolio = await paginate({
    model: Portfolio,
    page,
    limit,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Portfolios fetched sucessfully",
    data: portfolio,
  });
});
const getAllVerifiedPortfolios = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;

  const portfolios = await Portfolio.find()
    .populate({
      path: "user",
      match: { isValidated: true },
      select: "name email country state areaOfIntrest",
    })
    .skip(startIndex)
    .limit(limit)
    .exec();

  // Filter out portfolios with unverified users
  const verifiedPortfolios = portfolios.filter(
    (portfolio) => portfolio.user !== null
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Portfolios fetched sucessfully",
    totalPages: Math.ceil(verifiedPortfolios.length / limit),
    currentPage: page,
    data: verifiedPortfolios,
  });
});

const getPortfolioById = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ _id: req.params.id });
  if (!portfolio) {
    throw new CustomError.NotFoundError("Portfolio not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Portfolio fetched sucessfully",
    data: portfolio,
  });
});

const getMyPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne({ user: req.user.userId });
  if (!portfolio) {
    throw new CustomError.NotFoundError("Portfolio not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Portfolio fetched sucessfully",
    data: portfolio,
  });
});

const updatePortfolio = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const portfolio = await Portfolio.findOne({ user: req.user.userId });
  if (!portfolio) {
    throw new CustomError.NotFoundError("Portfolio not found");
  }
  const urls = [];
  const files = req.files;

  if (files && files.length > 0) {
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.url);
      fs.unlinkSync(path);
    }
  } else {
    urls.push(...portfolio.images);
  }

  portfolio.mission = req.body.mission;
  portfolio.vision = req.body.vision;
  portfolio.overview = req.body.overview;
  portfolio.projects = req.body.projects;
  portfolio.url = req.body.url;
  portfolio.images = urls;

  await portfolio.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Portfolio updated sucessfully",
    data: portfolio,
  });
});

const deletePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOneAndDelete({ user: req.user.userId });

  if (!portfolio) {
    throw new CustomError.NotFoundError("Portfolio not found");
  }

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
  });
});

const uploadImages = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const urls = [];
  const files = req.images;

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
const uploadImage = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const file = req.file;

  if (!file) {
    throw new CustomError.BadRequestError("Files required");
  }

  const { path } = file;
  const url = await uploader(path);
  fs.unlinkSync(path);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "image uploaded sucessfully",
    data: url.url,
  });
});

module.exports = {
  createPortfolio,
  getAllPortfolios,
  getAllVerifiedPortfolios,
  getPortfolioById,
  getMyPortfolio,
  updatePortfolio,
  deletePortfolio,
  uploadImages,
  uploadImage,
};
