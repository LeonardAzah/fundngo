const Donation = require("../models/Donation");
const User = require("../models/User");
const Account = require("../models/Account");
const asyncHandler = require("../utils/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../utils/paginate");
const CustomError = require("../errors");
const paystack = require("../config/paystack");

const createDonation = asyncHandler(async (req, res) => {
  const ngoId = req.params.id;
  const user = req.user;
  const ngo = await User.findById(ngoId);
  let amount = req.body.amount;
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  req.body.ngo = ngoId;
  let donation;

  if (user != undefined) {
    req.body.user = user.userId;
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

  donation.paystack_ref = response.data.reference;
  await donation.save();

  const result = {
    donation,
    response,
  };

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Authorization URL created",
    data: result,
  });
});

const verifyTrans = asyncHandler(async (req, res) => {
  const { donationId } = req.body;

  const donation = await Donation.findById(donationId);

  if (!donation) {
    throw new CustomError.NotFoundError("Donation not found");
  }

  if (donation.paystack_ref == "successs") {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Transaction has been verified",
    });
  }

  const response = await paystack.transaction.verify({
    reference: donation.paystack_ref,
  });

  if (response.data.status == "success") {
    const data = {
      paystack_ref: response.data.status,
      amountDonated: response.data.amount,
    };
    await Donation.findByIdAndUpdate(donation._id, data);
    const account = await Account.findOne({ ngo: donation.ngo });
    account.currentAmount += response.data.amount;
    await account.save();
    res.status(StatusCodes.OK).json({
      data: response.data,
      message: response.message,
      status: response.status,
    });
  } else {
    return res.status(200).send({
      data: response.data,
      message: response.message,
      status: response.status,
    });
  }
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
