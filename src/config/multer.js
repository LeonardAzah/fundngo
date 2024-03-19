const multer = require("multer");

const DIR = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.orginalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  const allowedFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploads = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadWithPdf = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter: pdfFileFilter,
});

module.exports = { uploads, uploadWithPdf };
