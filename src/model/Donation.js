const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    donorEmail: String,
    donorName: String,
    paystack_ref: {
      type: String,
    },
    isMonthly: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Donation", donationSchema);
