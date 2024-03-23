const Project = require("../model/Project");
const Donation = require("../model/Donation");
const PaymentTransaction = require("../model/PaymentTranscation");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");

const createDonation = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.body.projectId);

  if (!project) {
    throw new CustomError.NotFoundError("Project not found");
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
    project: donation.project,
    donorEmail: donation.donorEmail,
    // paymentId: charge.id,
  });
  await paymentTransaction.save();

  await Project.findOneAndUpdate(
    { _id: donor.project },
    { $inc: { currentAmount: amount } },
    { new: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donation created sucessfully",
  });
});

const getAllDonations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "Project",
      path: "project",
      select: "title",
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
  const populateOptions = [
    {
      model: "Project",
      path: "project",
      select: "title",
    },
  ];
  const donations = await paginate({
    model: Donation,
    page,
    limit,
    filters,
    populateOptions,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Donations fetched sucessfully",
    data: donations,
  });
});

const getDonationaByProjectId = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const project = req.params.id;
  const filters = { project };

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
  const projectId = req.params.id;
  const donation = await Donation.findById({ project: projectId });

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
  getDonationaByProjectId,
  getDonationById,
};
