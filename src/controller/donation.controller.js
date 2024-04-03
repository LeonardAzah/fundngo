const Donation = require("../model/Donation");
const User = require("../model/User");
const Account = require("../model/Account");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");
const paystack = require("../config/paystack");

const createDonation = asyncHandler(async (req, res) => {
  const ngoId = req.params.id;
  const { userId } = req.user;
  const ngo = await User.findById(ngoId);
  let amount = req.body.amount;
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  req.body.ngo = ngoId;
  let donation;

  if (userId) {
    req.body.user = userId;
    donation = new Donation(req.body);
    await donation.save();
  } else {
    donation = new Donation(req.body);
    await donation.save();
  }

  //   process payment with paystack
  amount *= 100;
  const response = await paystack.transaction.initialize({
    amount: amount,
    email: req.body.email,
  });

  const data = {
    paystack_ref: response.data.reference,
  };

  await Donation.findByIdAndUpdate(donation._id, data);

  const result = {
    donation,
    response,
  };

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Donation created sucessfully",
    data: result,
  });
});

const verifyTrans = asyncHandler(async (req, res) => {
  const donationId = req.params.id;

  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new CustomError.NotFoundError("Donation not found");
  }

  const response = await paystack.transaction.verify({
    reference: donation.paystack_ref,
  });

  if (response.data.status != "success") {
    CustomError.CustomAPIError(
      "Payment failed",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  const data = {
    paystack_ref: response.data.status,
    amountDonated: response.data.amount,
    status: "success",
  };
  await Donation.findByIdAndUpdate(donation._id, data);

  await Account.findOneAndUpdate(
    { ngo: donation.ngo },
    { $inc: { currentAmount: response.data.amount } },
    { new: true }
  );
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donation sucessful",
  });
});

const getAllDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "User",
      path: "user",
      select: "name photo",
    },
  ];
  const donations = await paginate({
    model: Donation,
    page,
    limit,
    populateOptions,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donations fetched sucessfully",
    data: donations,
  });
});

const getAllMyDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { userId } = req.user;
  const filters = { user: userId };

  const donations = await paginate({
    model: Donation,
    page,
    limit,
    filters,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donations fetched sucessfully",
    data: donations,
  });
});

const getDonationsByNgoId = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const ngoId = req.params.id;
  const filters = { user: ngoId };

  const donations = await paginate({
    model: Donation,
    page,
    limit,
    filters,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donations fetched sucessfully",
    data: donations,
  });
});

const getDonationById = asyncHandler(async (req, res) => {
  const donationId = req.params.id;
  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new CustomError.NotFoundError("Donation not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donation fetched sucessfully",
    data: donation,
  });
});

module.exports = {
  createDonation,
  getAllDonations,
  getAllMyDonations,
  getDonationById,
  getDonationsByNgoId,
  verifyTrans,
};
