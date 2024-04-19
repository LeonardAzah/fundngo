require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/db");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/error-handler");
const logger = require("./utils/logger");

const donorRoutes = require("./routes/donor.routes");
const ngoRoutes = require("./routes/ngo.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const portfolioRoutes = require("./routes/portfolios.routes");
const ngoPaymentDetailsRoutes = require("./routes/PaymentDetails.routes");
const donationRoutes = require("./routes/donation.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests", // message to send
});
app.set("trust proxy", 1);

app.use(cors());
app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(passport.initialize());
require("./config/googleAuth")(passport);

app.get("/", (req, res) => {
  // res.send('<a href="/api/v1/google">Authenticate with google</a>');
  res.send("fundngo.com");
});

app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/portfolios", portfolioRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/payment-details", ngoPaymentDetailsRoutes);
app.use("/api/v1/ngos", ngoRoutes);
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/", authRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
let server;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server = app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
