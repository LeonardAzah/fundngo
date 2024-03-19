const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    mission: {
      type: String,
      required: true,
    },

    vision: {
      type: String,
      required: true,
    },

    overview: {
      type: String,
      required: true,
    },
    projects: {
      type: [String],
    },
    url: {
      type: String,
    },
    images: {
      type: [String],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
