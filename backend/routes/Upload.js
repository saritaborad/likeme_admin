const express = require("express");
const router = express.Router();
const { uploadImage } = require("../middleware/upload");
const { giveresponse } = require("../utils/res_help");

router.post("/img", uploadImage.array("image"), (req, res) => {
 if (!req.files || req.files.length === 0) {
  return giveresponse(res, 400, false, "No images uploaded");
 }

 const imageUrls = req.files.map((file) => file.path);
 return giveresponse(res, 200, true, "Images uploaded", imageUrls);
});

router.post("/video", uploadImage.array("video"), (req, res) => {
 if (!req.files || req.files.length === 0) {
  return giveresponse(res, 400, false, "No Video uploaded");
 }

 const videoUrls = req.files.map((file) => file.path);
 return giveresponse(res, 200, true, "Video uploaded", videoUrls);
});

module.exports = router;
