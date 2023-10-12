const Image = require("../models/Image");
const Video = require("../models/Video");
const User = require("../models/User");
const Agent = require("../models/Agent");
const Country = require("../models/Country");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const fs = require("fs");
const path = require("path");

// exports.fetchHostImages = asyncHandler(async (req, res, next) => {
//  const apiFeature = new ApiFeatures(Image.find({ user_id: req.body._id }), req.body).search().sort().pagination();
//  const images = await apiFeature.query;
//  apiFeature.totalRecord = await Image.countDocuments({ user_id: req.body._id });
//  return giveresponse(res, 200, true, "Host image fetch success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, images });
// });

// exports.fetchHostVideos = asyncHandler(async (req, res, next) => {
//  const apiFeature = new ApiFeatures(Video.find({ user_id: req.body._id }), req.body).search().sort().pagination();
//  const video = await apiFeature.query;
//  apiFeature.totalRecord = await Video.countDocuments({ user_id: req.body._id });
//  return giveresponse(res, 200, true, "Host video get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, video });
// });

exports.MakeHost = asyncHandler(async (req, res, next) => {
 const user = await User.findById({ _id: req.body._id });
 if (!user) return giveresponse(res, 404, false, "User not found");

 user.is_host = 2;
 await user.save();

 return giveresponse(res, 200, true, "Updated successfully!");
});

exports.fetchHostApplications = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(User.find({ is_block: 0, is_host: 1 }).populate({ path: "images", select: "image -_id -user_id" }).select("_id fullName age identity profileimages"), req.body?.options).search().sort().pagination();
 const hostApp = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments({ is_block: 0, is_host: 1 });
 return giveresponse(res, 200, true, "Host application get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, hostApp });
});

exports.RejectHost = asyncHandler(async (req, res, next) => {
 const images_all = await Image.find({ user_id: req.body._id });
 const videos_all = await Video.find({ user_id: req.body._id });

 for (const image of images_all) {
  const imagePath = path.join(__dirname, "..", image.image);
  if (fs.existsSync(imagePath) && image.image !== null) {
   fs.unlinkSync(imagePath);
  }

  await Image.findByIdAndDelete({ _id: image._id });
 }

 for (const video of videos_all) {
  const videoPath = path.join(__dirname, "..", video.video);
  if (fs.existsSync(videoPath) && video.video !== null) {
   fs.unlinkSync(videoPath);
  }

  await Video.findByIdAndDelete({ _id: video._id });
 }

 const result = await User.updateOne({ _id: req.body._id }, { $set: { diamond_per_min: null, intrests: null, availabiltyHours: null, bio: null, about: null, age: null, is_host: 0, billingAddress: null } });

 if (result) return giveresponse(res, 200, true, "Host rejected successfully.");
});

exports.viewHost = asyncHandler(async (req, res, next) => {
 const all_agents = await Agent.find();
 const countries = await Country.find();
 const host = await User.findOne({ _id: req.body._id }).select("fullName availabiltyHours diamond_per_min email about billingAddress bio age intrests");
 return giveresponse(res, 200, true, "view host success.", { host, countries, all_agents });
});

exports.requestUserById = asyncHandler(async (req, res, next) => {
 const user = await User.findById({ _id: req.body._id });
 return giveresponse(res, 200, true, "User get success.", user);
});
