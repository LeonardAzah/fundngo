const mongoose = require("mongoose");

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

module.exports = mongoose.model("Card", cardSchema);
