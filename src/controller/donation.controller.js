const Donation = require("../model/Donation");
const User = require("../model/User");
const Account = require("../model/Account");
const PaymentTransaction = require("../model/PaymentTranscation");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");

const createDonation = asyncHandler(async (req, res) => {
  const ngoId = req.params.id;
  const ngo = await User.findById(ngoId);
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }
  const donation = new Donation(req.body);
  await donation.save();

  //   process payment with flutterwave or paystack
  //     const charge = await stripe.charges.create({
  //       amount: amount * 100, // Stripe requires amount in cents
  //       currency: 'usd',
  //       description: `Donation to ${project.title}`,
  //       source: token, // Token from Stripe checkout
  //     });

  // save payment transcation
  const paymentTransaction = new PaymentTransaction({
    amount: donation.amount,
    donorEmail: donation.donorEmail,
    // paymentId: charge.id,
  });
  await paymentTransaction.save();

  await Account.findOneAndUpdate(
    { _id: ngo._id },
    { $inc: { currentAmount: amount } },
    { new: true }
  );
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Donation created sucessfully",
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
};
