const path = require("path");
const Image = require("../models/Image");
const ImageReview = require("../models/ImageReview");
const VideoReview = require("../models/VideoReview");
const Video = require("../models/Video");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");
const fs = require("fs");
const { ObjectId } = require("mongodb");

exports.ImageById = asyncHandler(async (req, res, next) => {
 const result = await Image.find({ user_id: req.body._id });
 return giveresponse(res, 200, true, "Image get success.", result);
});

exports.deleteImageById = asyncHandler(async (req, res, next) => {
 const image = await Image.findById(req.body._id);

 if (!image) return giveresponse(res, 404, false, "Image not found");

 if (image.image !== null) {
  const imagePath = path.join(__dirname, "..", image.image); // Adjust the path as needed

  if (fs.existsSync(imagePath)) {
   fs.unlinkSync(imagePath);
  }
 }

 await Image.findByIdAndDelete({ _id: new ObjectId(req.body._id) });

 return giveresponse(res, 200, true, "Successfully deleted image");
});

exports.fetchHostImages = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Image.find({ user_id: req.body._id }), req.body?.options).search().sort().pagination();
 const images = await apiFeature.query;
 apiFeature.totalRecord = await Image.countDocuments({ user_id: req.body._id });
 return giveresponse(res, 200, true, "Images get successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: images });
});

exports.fetchAllImageReview = asyncHandler(async (req, res, next) => {
 const images = await ImageReview.find().sort({ _id: -1 });
 const total = await ImageReview.countDocuments();
 return giveresponse(res, 200, true, "fetch image success", { total, images });
});

exports.acceptImageReview = asyncHandler(async (req, res, next) => {
 const image = await ImageReview.findOne({ _id: req.body._id });
 const img = new Image({ image: image.image, user_id: image.user_id });
 await img.save();
 await ImageReview.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Image Accepted");
});

exports.rejectImageReview = asyncHandler(async (req, res, next) => {
 const image = await ImageReview.findOneAndDelete({ _id: req.body._id });
 if (image) return giveresponse(res, 200, true, "Image rejected");
});
