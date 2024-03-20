const Project = require("../model/Project");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");
const Account = require("../model/Account");
const checkPermissions = require("../util/checkPermissions");
const User = require("../model/User");

const createProject = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  req.body.user = userId;

  const project = new Project(req.body);
  await project.save();

  await Account.create({ project: project._id });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Project created sucessfully",
    data: project,
  });
});

const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "User",
      path: "user",
      select: "name  photo areaOfIntrest country",
    },
  ];
  const projects = await paginate({
    model: Project,
    page,
    limit,
    populateOptions,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects fetched sucessfully",
    data: projects,
  });
});

const getAllActiveProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "User",
      path: "user",
      select: "name  photo areaOfIntrest country",
    },
  ];

  const filters = { isActive: true };
  const projects = await paginate({
    model: Project,
    page,
    limit,
    filters,
    populateOptions,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects fetched sucessfully",
    data: projects,
  });
});

const getMyProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { userId } = req.user;
  const filters = { user: userId };
  const projects = await paginate({
    model: Project,
    page,
    limit,
    filters,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects fetched sucessfully",
    data: projects,
  });
});
const getMyActiveProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { userId } = req.user;
  const filters = { user: userId, isActive: true };
  const projects = await paginate({
    model: Project,
    page,
    limit,
    filters,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Projects fetched sucessfully",
    data: projects,
  });
});

const activateProject = asyncHandler(async (req, res) => {
  const Id = req.params.id;

  const project = await Project.findById({ _id: Id });

  if (!project) {
    throw new CustomError.NotFoundError("Project not found");
  }

  project.isActive = true;

  await project.save();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project activated sucessfully",
    data: project,
  });
});

const deactivateProject = asyncHandler(async (req, res) => {
  const Id = req.params.id;

  const project = await Project.findById({ _id: Id });

  if (!project) {
    throw new CustomError.NotFoundError("Project not found");
  }

  project.isActive = false;

  await project.save();
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project deactivated sucessfully",
    data: project,
  });
});

const getProjectById = asyncHandler(async (req, res) => {
  const Id = req.params.id;

  const project = await Project.findById({ _id: Id });

  if (!project) {
    throw new CustomError.NotFoundError("Project not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project fetched sucessfully",
    data: project,
  });
});

const updateProject = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  const user = await User.findById({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("NGO not found");
  }

  const project = await Project.findById({ _id: Id });

  if (!project) {
    throw new CustomError.NotFoundError("Project not found");
  }
  checkPermissions(user, project.user);
  const updatedProject = await Project.findByIdAndUpdate(
    {
      _id: Id,
    },
    req.body,
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Project updated sucessfully",
    data: updatedProject,
  });
});

module.exports = {
  createProject,
  getAllProjects,
  getAllActiveProjects,
  getMyProjects,
  getMyActiveProjects,
  activateProject,
  deactivateProject,
  getProjectById,
  updateProject,
};
