const multer = require("multer");
const fs = require("fs");

// Define storage options for images and videos
const imageStorage = multer.diskStorage({
 destination: (req, file, cb) => {
  const directory = file.fieldname === "video" ? "uploads/videos" : "uploads/images";
  fs.mkdirSync(directory, { recursive: true });
  cb(null, directory);
 },
 filename: (req, file, cb) => {
  const uniqueSuffix = Date.now();
  cb(null, uniqueSuffix + "-" + file.originalname);
 },
});

const videoStorage = multer.diskStorage({
 destination: (req, file, cb) => {
  const directory = "uploads/video";
  fs.mkdirSync(directory, { recursive: true });
  cb(null, directory);
 },
 filename: (req, file, cb) => {
  const uniqueSuffix = Date.now();
  cb(null, uniqueSuffix + "-" + file.originalname);
 },
});

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });

module.exports = { uploadImage, uploadVideo };
