const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.blogPic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/blog-pic");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

exports.profilePic = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/profile-images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
