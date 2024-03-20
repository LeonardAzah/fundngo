const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    mission: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    vision: {
      type: String,
      required: true,
    },

    overview: {
      type: String,
    },
    images: {
      type: [String],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
