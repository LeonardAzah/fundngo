const Profile = require("../model/Profile");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const createProfile = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  req.body.images = urls;
  const userId = req.user.userId;
  req.body.user = userId;

  const profile = new Profile(req.body);
  await profile.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "profile created sucessfully",
    data: profile,
  });
});

const getAllProfiles = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const profiles = await paginate({
    model: Profile,
    page,
    limit,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "profiles fetched sucessfully",
    data: profiles,
  });
});

const getProfileById = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne(req.params.id);
  if (!profile) {
    throw new CustomError.NotFoundError("Profile not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "profile fetched sucessfully",
    data: profile,
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne(req.user.userId);
  if (!profile) {
    throw new CustomError.NotFoundError("Profile not found");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "profile fetched sucessfully",
    data: profile,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "fundngo");

  const profile = await Profile.findOne({ user: req.user.userId });
  if (!profile) {
    throw new CustomError.NotFoundError("Profile not found");
  }
  const urls = [];
  const files = req.files;

  if (files && files.length > 0) {
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
  } else {
    urls.push(...profile.images);
  }

  profile.mission = req.body.mission;
  profile.vision = req.body.vision;
  profile.overview = req.body.overview;
  profile.projects = req.body.projects;
  profile.url = req.body.url;
  profile.images = urls;

  await profile.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "profile updated sucessfully",
    data: profile,
  });
});

const deleteProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOneAndDelete({ user: req.user.userId });

  if (!profile) {
    throw new CustomError.NotFoundError("Profile not found");
  }

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
  });
});

module.exports = {
  createProfile,
  getAllProfiles,
  getProfileById,
  getMyProfile,
  updateProfile,
  deleteProfile,
};
