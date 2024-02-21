require("dotenv").config();
const express = require("express");

const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const connectDB = require("./config/db");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/error-handler");
const logger = require("./util/logger");

const donorRoutes = require("./routes/donor.routes");
const ngoRoutes = require("./routes/ngo.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.set("trust proxy", 1);

app.use(cors());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload({ useTempFiles: true }));

app.get("/", (req, res) => {
  res.send("fundngo");
});

app.use("/api/v1/donors", donorRoutes);
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
