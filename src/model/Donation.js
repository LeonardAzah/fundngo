const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    amount: { type: Number, required: true },
    donorEmail: String,
    donorName: String,
    isMonthly: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "processed"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
