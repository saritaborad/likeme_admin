const { asyncHandler, giveresponse } = require("../utils/res_help");
const Subscription = require("../models/Subscription");
const ApiFeatures = require("../utils/ApiFeatures");

exports.fetchAllCoinPlans = asyncHandler(async (req, res, next) => {
 let query = req.body.package_name ? { package_name: req.body.package_name } : {};
 const apiFeature = new ApiFeatures(Subscription.find(query), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await Subscription.countDocuments(query);
 return giveresponse(res, 200, true, "All coin plan get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.addSubcription = asyncHandler(async (req, res, next) => {
 const { price, discount_price, diamond, play_store_id, app_store_id, orignal_sku, highlight_text, package_name } = req.body;
 const subcription = new Subscription({ price, discount_price, discount: Math.round((discount_price / price) * 100), diamond, play_store_id, app_store_id, orignal_sku, highlight_text, package_name });
 const result = await subcription.save();
 if (result) return giveresponse(res, 200, true, "subcription added successfully!");
});

exports.updateSubcription = asyncHandler(async (req, res) => {
 const { _id, discount_price, price, diamond, play_store_id, app_store_id, orignal_sku, highlight_text } = req.body;
 const result = await Subscription.updateOne({ _id }, { $set: { price, discount_price, discount: Math.round((discount_price / price) * 100), diamond, play_store_id, app_store_id, orignal_sku, highlight_text } });
 if (result) return giveresponse(res, 200, true, "subscription updated.");
});

exports.deleteSubcriptionById = asyncHandler(async (req, res) => {
 const result = await Subscription.findByIdAndDelete({ _id: req.body._id });
 if (result) return giveresponse(res, 200, true, "subscription data deleted.");
});

exports.default_flag = asyncHandler(async (req, res) => {
 const result = await Subscription.findOneAndUpdate({ default_flag: 1 }, { $set: { default_flag: 0 } });
 const result1 = await Subscription.findOneAndUpdate({ _id: req.body._id }, { $set: { default_flag: 1 } });
 return giveresponse(res, 200, true, "default subcription is updated");
});

// -----------Android API routes ------------

exports.allSubcription = asyncHandler(async (req, res) => {
 const { package_name } = req.body;
 let query = !package_name ? { package_name: "com.likeme.makematchcall" } : { package_name };
 const result = await Subscription.find(query).sort({ position: 1 });
 return giveresponse(res, 200, true, "data fetch success.", result);
});

exports.subcriptionById = asyncHandler(async (req, res, next) => {
 const result = await Subscription.findOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "Subscription get success.", result);
});
