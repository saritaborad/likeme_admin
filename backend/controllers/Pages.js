const Pages = require("../models/Page");
const { asyncHandler, giveresponse } = require("../utils/res_help");

exports.addPageData = asyncHandler(async (req, res) => {
 const { description, type } = req.body;
 let setData = type == 0 ? { terms_of_use: description } : { privacy_policy: description };
 const data = await Pages.findOneAndUpdate({ type }, { $set: setData }, { upsert: true });
 return giveresponse(res, 200, true, "Data updated");
});

exports.getPageData = asyncHandler(async (req, res, next) => {
 const result = await Pages.findOne({ type: req.body.type });
 return giveresponse(res, 200, true, "Data get successfully!", result);
});

exports.privacy_policy = asyncHandler(async (req, res, next) => {
 const result = await Pages.findOne();
 return giveresponse(res, 200, true, "Privacy policy get successfully!", result.privacy_policy);
});

exports.terms_conditions = asyncHandler(async (req, res, next) => {
 const result = await Pages.findOne();
 return giveresponse(res, 200, true, "Data terms and condition successfully!", result.terms_of_use);
});

// ------------- android api --------------

exports.privacyPolicy = asyncHandler(async (req, res, next) => {
 const result = await Pages.find();
 return giveresponse(res, 200, true, "Data get successfully!", result);
});
