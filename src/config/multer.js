const multer = require("multer");

const DIR = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },

  filename: (req, file, cb) => {
    cb(null, new Date().toIS0String() + "-" + file.orginalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jepg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = upload;
