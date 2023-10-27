const Country = require("../models/Country");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const Video = require("../models/Video");
const Images = require("../models/Image");
const User = require("../models/User");
const ApiFeatures = require("../utils/ApiFeatures");
const { generateCode, generateThumb } = require("../utils/commonFunc");

exports.fakeUser = asyncHandler(async (req, res, next) => {
 const countries = await Country.find();
 return giveresponse(res, 200, true, "fake user get success.", { countries });
});

exports.addfakeUser = asyncHandler(async (req, res, next) => {
 const { country_id, about, bio, age, fullName, images } = req.body;
 const intrest_type = ["music", "movie", "crime-series", "cricket-match", "football-match"];

 const keys = Object.keys(intrest_type)
  .sort(() => 0.5 - Math.random())
  .slice(0, 3);

 const intrests = keys.map((key) => intrest_type[key]);

 const addfakeuser = new User({ country_id, about, email: "--", billingAddress: "--", bio, age, identity: generateCode(), intrests, fullName, availabiltyHours: 0, diamond_per_min: Math.floor(Math.random() * (100 - 50 + 1)) + 50, is_fake: 1, is_host: 2, diamond: 0 });
 await addfakeuser.save();

 // Save videos
 if (req.files["video"]) {
  for (const video of req.files["video"]) {
   const thumbnailPath = path.join("uploads/thumbnail/" + file.filename.split(".")[0] + ".jpg");
   const thumbName = file.filename.split(".")[0] + ".jpg";
   generateThumb(video.path, thumbName);
   const it = new Video({ video: video.path, user_id: addfakeuser._id, thumbnail_image: thumbnailPath });
   await it.save();
  }
 }

 // Save images
 if (req.files["images"]) {
  for (const img of req.files["images"]) {
   const it = new Images({ image: img.path, user_id: addfakeuser._id });
   await it.save();
  }
 }

 return giveresponse(res, 200, true, "Fake user added!");
});

exports.fetchAllFakeUser = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(User.find({ is_fake: 1 }).populate("images").select("fullName identity profileimages"), req.body).search().sort().pagination();
 const users = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments({ is_fake: 1 });
 return giveresponse(res, 200, true, "Fake user fetch success.", { totalRecord: apiFeature.totalRecord, data: users, totalPage: apiFeature.totalPage });
});
