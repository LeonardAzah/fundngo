const express = require("express");
const paymentTransactionController = require("../controllers/paymentTransaction.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorizePermissions("admin"),
  paymentTransactionController.getAllPaymentTransactions
);

router.get(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  paymentTransactionController.getPaymentTransactionById
);

module.exports = router;
