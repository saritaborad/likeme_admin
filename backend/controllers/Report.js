const User = require("../models/User");
const Report = require("../models/Report");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");

exports.deleteReport = asyncHandler(async (req, res, next) => {
 const result = await Report.deleteOne({ _id: req.body._id });
 if (result) return giveresponse(res, 200, true, "Delete record successfully");
});

exports.fetchReports = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Report.find().populate({ path: "user", select: "_id profileimages is_fake fullName identity", populate: { path: "images", select: "image -_id -user_id" } }), req.body?.options).search().sort().pagination();
 const reports = await apiFeature.query;
 apiFeature.totalRecord = await Report.countDocuments();
 return giveresponse(res, 200, true, "Report get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, reports });
});

//-----------android api route -------

exports.report = asyncHandler(async (req, res, next) => {
 const { user_id, reason, description } = req.body;
 const user = await User.findOne({ _id: user_id, is_block: 0 });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");
 const report = new Report({ user_id, reason, description });
 await report.save();
 return giveresponse(res, 200, true, "Reported successfully");
});
