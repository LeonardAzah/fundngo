const express = require("express");
const cardController = require("../controller/card.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  authorizePermissions("ngo"),
  cardController.createCard
);

router.get(
  "/all",
  authenticateUser,
  authorizePermissions("ngo"),
  cardController.getAllCards
);

router.get(
  "/",
  authenticateUser,
  authorizePermissions("ngo"),
  cardController.getMyCards
);

router.get(
  "/ngo/:id",
  authenticateUser,
  authorizePermissions("admin"),
  cardController.getCardsByNgoId
);

router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  cardController.updateCard
);

router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  cardController.deleteCard
);

router.get(
  "/:id",
  authenticateUser,
  authorizePermissions(["ngo", "admin"]),
  cardController.getCardById
);

module.exports = router;
