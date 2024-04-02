const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  donorEmail: String,
  transactionId: String,
  status: String,
  reference: {
    type: String,
  },
  access_code: {
    type: String,
  },
  channel: {
    type: String,
  },
  currency: {
    type: String,
  },
  card_type: {
    type: String,
  },
  bank: {
    type: String,
  },
  paidAt: {
    type: Date,
  },
});

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
