const { giveresponse, asyncHandler } = require("../utils/res_help");
const Gifts = require("../models/Gift");
const ApiFeatures = require("../utils/ApiFeatures");
const path = require("path");
const fs = require("fs");

exports.fetchAllgifts = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Gifts.find(), req.body?.options).search().sort().pagination();
 const gifts = await apiFeature.query;
 apiFeature.totalRecord = await Gifts.countDocuments();
 return giveresponse(res, 200, true, "All gifts get successfully.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, gifts });
});

exports.addGifts = asyncHandler(async (req, res, next) => {
 const gift = new Gifts({ diamond: req.body.diamond, images: req.file.path });
 const result = await gift.save();
 if (!result) return giveresponse(res, 400, false, "Failed to add image");
 return giveresponse(res, 200, true, "Successfully added image (only png)");
});

exports.editGift = asyncHandler(async (req, res, next) => {
 const { _id, diamond, images } = req.body;

 let updateData = { diamond };

 if (images || req.file?.path) {
  const unlinkData = await Gifts.findById(_id);

  if (unlinkData.images) {
   const imagePath = path.join(__dirname, "..", unlinkData.images);
   if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
   }
  }
  updateData.images = images || req.file?.path;
 }

 const result = await Gifts.updateOne({ _id }, updateData);

 if (result) return giveresponse(res, 200, true, "Successfully updated");
});

exports.deleteGift = asyncHandler(async (req, res, next) => {
 const gift_data = await Gifts.findById({ _id: req.body._id });
 if (gift_data.images && fs.existsSync(path.join(__dirname, "..", gift_data.images))) fs.unlinkSync(path.join(__dirname, "..", gift_data.images));
 const result = await gift_data.deleteOne();
 if (result) return giveresponse(res, 200, true, "Successfully deleted");
});

exports.giftList = asyncHandler(async (req, res, next) => {
 const result = await Gifts.find().sort({ _id: -1 });
 return giveresponse(res, 200, true, "gift list get successfully", result);
});
