const Card = require("../model/Card");
const User = require("../model/User");
const asyncHandler = require("../util/asyncHandler");
const StatusCodes = require("http-status-codes");
const paginate = require("../util/paginate");
const CustomError = require("../error");
const checkPermissions = require("../util/checkPermissions");

const createCard = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { cardName, cardno, expiryDate, cvv, cardProvider } = req.body;

  //check if user has existing card
  const cardExist = await Card.findOne({ user: userId });
  if (cardExist) {
    cardExist.isActive = false;
    cardExist.save();
  }
  const card = await Card.create({
    cardName,
    cardno,
    expiryDate,
    cvv,
    cardProvider,
    user: userId,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Card created sucessfully",
    data: card,
  });
});

const getAllCards = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const populateOptions = [
    {
      model: "User",
      path: "user",
      select: "name email country",
    },
  ];

  const cards = await paginate({
    model: Card,
    page,
    limit,
    populateOptions,
  });
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Cards fetched sucessfully",
    data: cards,
  });
});

const getCardsByNgoId = asyncHandler(async (req, res) => {
  const ngoId = req.params.id;

  const ngo = await User.findById({ _id: ngoId });
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }

  const cards = await Card.find({ user: ngoId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Cards fetched sucessfully",
    data: cards,
  });
});
const getMyCards = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const ngo = await User.findById(userId);
  if (!ngo) {
    throw new CustomError.NotFoundError("NGO not found");
  }

  const cards = await Card.find({ user: userId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Cards fetched sucessfully",
    data: cards,
  });
});

const getCardById = asyncHandler(async (req, res) => {
  const cardId = req.params.id;

  const card = await Card.findById({ _id: cardId });
  if (!card) {
    throw new CustomError.NotFoundError("Card not found");
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Card fetched sucessfully",
    data: card,
  });
});

const updateCard = asyncHandler(async (req, res) => {
  const cardId = req.params.id;
  const { userId } = req.user;
  const [user, card] = await Promise.all([
    User.findById(userId),
    Card.findById(cardId),
  ]);

  if (!user) {
    throw new CustomError.NotFoundError("User not found");
  }
  if (!card) {
    throw new CustomError.NotFoundError("Card not found");
  }

  checkPermissions(user, card.user);

  const updatedcard = Card.findByIdAndUpdate({ _id: cardId }, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Card updated sucessfully",
    data: updatedcard,
  });
});

const deleteCard = asyncHandler(async (req, res) => {
  const cardId = req.params.id;
  const card = await Card.findOneAndDelete({ _id: cardId });

  if (!card) {
    throw new CustomError.NotFoundError("Card not found");
  }

  res.status(StatusCodes.NO_CONTENT).json({
    success: true,
  });
});

module.exports = {
  createCard,
  getAllCards,
  getCardsByNgoId,
  getMyCards,
  getCardById,
  updateCard,
  deleteCard,
};
