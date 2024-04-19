const express = require("express");
const paymentController = require("../controllers/payment.controller");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const validateRequest = require("../middleware/validateRequest");
const { paymentDetailValidate } = require("../validators/paymentDetails");
const validateId = require("../validators/Id.validate");

const router = express.Router();

router.post(
  "/",
  validateRequest(paymentDetailValidate),
  authenticateUser,
  authorizePermissions("ngo"),
  paymentController.createPayment
);

router.get(
  "/",
  authenticateUser,
  authorizePermissions("ngo"),
  paymentController.getMyPaymentDetails
);

router.put(
  "/",
  authenticateUser,
  validateRequest(paymentDetailValidate),
  authorizePermissions("ngo"),
  paymentController.updatePayment
);

router.get(
  "/:id",
  validateRequest(validateId),
  authenticateUser,
  authorizePermissions("ngo"),
  paymentController.getPaymentDetailsById
);

module.exports = router;
