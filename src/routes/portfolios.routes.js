const express = require("express");
const validateRequest = require("../middleware/validateRequest");
const portfolioController = require("../controllers/portfolio.controller");
const { uploads } = require("../config/multer");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createProtfolioValidation,
  getProtfolioByIdValidation,
} = require("../validators/protfolio.validate");
const validateId = require("../validators/Id.validate");

const router = express.Router();

router.post(
  "/",
  uploads.array("images", 10),
  validateRequest(createProtfolioValidation),
  authenticateUser,
  authorizePermissions("ngo"),
  portfolioController.createPortfolio
);
router.post(
  "/images",
  uploads.array("images", 10),
  authenticateUser,
  authorizePermissions("ngo"),
  portfolioController.uploadImages
);
router.post(
  "/image",
  uploads.single("image"),
  authenticateUser,
  portfolioController.uploadImage
);

router.get(
  "/all",
  authenticateUser,
  authorizePermissions("admin"),
  portfolioController.getAllPortfolios
);

router.get("/", portfolioController.getAllVerifiedPortfolios);

router.patch(
  "/",
  uploads.array("images", 10),
  authenticateUser,
  authorizePermissions("ngo"),
  validateRequest(createProtfolioValidation),
  portfolioController.updatePortfolio
);

router.get(
  "/me",
  authenticateUser,
  authorizePermissions("ngo"),
  portfolioController.getMyPortfolio
);
router.delete(
  authenticateUser,
  authorizePermissions("ngo"),
  portfolioController.deletePortfolio
);
router.get(
  "/:id",
  validateRequest(validateId),
  portfolioController.getPortfolioById
);

module.exports = router;
