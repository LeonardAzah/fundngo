const express = require("express");
const projectController = require("../controller/project.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.createProject
);

router.get(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  projectController.getAllProjects
);
router.get("/all", projectController.getAllActiveProjects);
router.get(
  "/my-projects",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.getMyProjects
);
router.get(
  "/my-active-projects",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.getMyActiveProjects
);

router.post(
  "/activate/:id",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.activateProject
);
router.post(
  "/deactivate/:id",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.deactivateProject
);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("ngo"),
  projectController.updateProject
);

router.get("/:id", projectController.getProjectById);
module.exports = router;
