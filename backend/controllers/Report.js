const User = require("../models/User");
const Report = require("../models/Report");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const ReportReson = require("../models/ReportReason");

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

exports.fetchAllReportReson = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(ReportReson.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await ReportReson.countDocuments();
 return giveresponse(res, 200, true, "Report reason get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data });
});

exports.addReportReson = asyncHandler(async (req, res, next) => {
 const newReportReson = new ReportReson({ title: req.body.title });
 await newReportReson.save();
 return giveresponse(res, 200, true, "ReportReson added successfully");
});

exports.updateReportReson = asyncHandler(async (req, res, next) => {
 const result = await ReportReson.updateOne({ _id: req.body._id }, { $set: { title: req.body.title } });

 if (result) {
  return giveresponse(res, 200, true, "Data updated successfully!");
 } else {
  return giveresponse(res, 400, false, "Something went wrong!");
 }
});

exports.deleteReportReson = asyncHandler(async (req, res, next) => {
 const result = await ReportReson.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Data deleted successfully!");
});

//-----------android api route -------

exports.reportReson = asyncHandler(async (req, res, next) => {
 const data = await ReportReson.find({ title: req.body.title });
 return giveresponse(res, 200, true, "Data fetch successfully", data);
});

exports.report = asyncHandler(async (req, res, next) => {
 const { user_id, reason, description } = req.body;

 const report = new Report({ user_id, reason, description });
 const user = await User.findOne({ _id: user_id, is_block: 0 });

 if (user) {
  await report.save();
  return giveresponse(res, 200, true, "Reported successfully");
 } else {
  return giveresponse(res, 404, false, "User doesn't exist!");
 }
});
