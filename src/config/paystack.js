require("dotenv").config();

const paystack = require("paystack-api")(process.env.PAYSTACK_SECRET_KEY);
module.exports = paystack;
