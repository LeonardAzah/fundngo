const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    paystack_ref: {
      type: String,
    },
    isMonthly: {
      type: Boolean,
      default: false,
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
