const mongoose = require("mongoose");
const CustomError = require("../error");

const cardSchema = new mongoose.Schema(
  {
    cardName: {
      type: String,
      required: true,
    },

    cardno: {
      type: String,
      required: true,
    },
    cardProvider: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },

    cvv: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validator function to limit the number of cards per user
cardSchema.pre("save", async function (next) {
  const userCardCount = await mongoose.models.Card.countDocuments({
    user: this.user,
  });
  if (userCardCount >= 2) {
    throw next(
      new CustomError.UnauthorizedError("A user can have only two cards")
    );
  }
  next();
});

cardSchema.pre("save", async function (next) {
  // Deactivate all other cards associated with the user
  await mongoose.models.Card.updateMany(
    { user: this.user },
    { $set: { isActive: false } }
  );

  next();
});

module.exports = mongoose.model("Card", cardSchema);
