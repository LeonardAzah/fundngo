const asyncHandler = require("../utils/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../utils/paginate");
const CustomError = require("../errors");
const paystack = require("../config/paystack");

const getAllPaymentTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "User",
      path: "ngo",
      select: "name photo",
    },
  ];

  // const payments = await paginate({
  //   model: PaymentTransaction,
  //   page,
  //   limit,
  //   populateOptions,
  // });

  const payments = await paystack.res.status(StatusCodes.OK).json({
    success: true,
    message: "Payments fetched sucessfully",
    data: payments,
  });
});

const getPaymentTransactionById = asyncHandler(async (req, res) => {
  const paymentId = req.params.id;
  const payment = await PaymentTransaction.findById(paymentId);

  if (!payment) {
    throw new CustomError.NotFoundError("Payment not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Payment fetched sucessfully",
    data: payment,
  });
});

module.exports = {
  getAllPaymentTransactions,
  getPaymentTransactionById,
};
