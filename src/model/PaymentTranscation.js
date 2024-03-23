const mongoose = require("mongoose");

const paymentTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  donorEmail: String,
  paymentId: String,
});

module.exports = mongoose.model("PaymentTransaction", paymentTransactionSchema);
