const Payment = require("../models/Payment");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const StatusCodes = require("http-status-codes");
const CustomError = require("../errors");

const createPayment = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { accountName, accountNumber, bankName } = req.body;
  const user = await User.findById(userId);

  const payment = await Payment.create({
    accountName,
    accountNumber,
    bankName,
  });

  user.payment = payment._id;
  await user.save();

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Payment details created sucessfully",
    data: payment,
  });
});

const getMyPaymentDetails = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);
  const paymentId = user.payment;
  const paymentDetails = await Payment.findById(paymentId);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Details fetched sucessfully",
    data: paymentDetails,
  });
});

const getPaymentDetailsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const payment = await Payment.findById(id);
  if (!payment) {
    throw new CustomError.NotFoundError("Payment details not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Card fetched sucessfully",
    data: payment,
  });
});

const updatePayment = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const user = await User.findById(userId);

  const paymentDetails = await Payment.findById(user.payment);
  if (!paymentDetails) {
    throw new CustomError.NotFoundError("Details not found");
  }

  const updatedDetails = await Payment.findByIdAndUpdate(
    { _id: user.payment },
    req.body,
    {
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Card updated sucessfully",
    data: updatedDetails,
  });
});

module.exports = {
  createPayment,
  getPaymentDetailsById,
  updatePayment,
  getMyPaymentDetails,
};
