const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
