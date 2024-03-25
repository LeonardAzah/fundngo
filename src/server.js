require("dotenv").config();
const express = require("express");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/db");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/error-handler");
const logger = require("./util/logger");

const donorRoutes = require("./routes/donor.routes");
const ngoRoutes = require("./routes/ngo.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const portfolioRoutes = require("./routes/portfolios.routes");
const projectRoutes = require("./routes/project.routes");
const donationRoutes = require("./routes/donation.routes");
const cardRoutes = require("./routes/card.routes");

const app = express();

app.set("trust proxy", 1);

app.use(cors());

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
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/ngos", ngoRoutes);
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/", authRoutes);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      logger.info(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
