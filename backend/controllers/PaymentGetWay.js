const PaymentGetWay = require("../models/PaymentGateway");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");

exports.fetchAllPayment = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(PaymentGetWay.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await PaymentGetWay.countDocuments();
 return giveresponse(res, 200, true, "all payment get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.addPayment = asyncHandler(async (req, res, next) => {
 const result = await PaymentGetWay.findOne({ payment_getway: req.body.payment_getway });
 if (result) return giveresponse(res, 500, false, "payment gateway already exists");
 const paymentGetway = new PaymentGetWay({ payment_getway: req.body.payment_getway });
 const savedResult = await paymentGetway.save();
 return giveresponse(res, 200, true, "payment gateway added successfully");
});

exports.updatePayment = asyncHandler(async (req, res, next) => {
 const result = await PaymentGetWay.findOneAndUpdate({ _id: req.body._id }, { payment_getway: req.body.payment_getway }, { new: true });
 if (result) {
  return giveresponse(res, 200, true, "payment geteway data updated successfully!");
 } else {
  return giveresponse(res, 500, false, "data is not updated");
 }
});

exports.deletePaymentById = asyncHandler(async (req, res, next) => {
 const result = await PaymentGetWay.deleteOne({ _id: req.body._id });
 if (result) return giveresponse(res, 200, true, "payment gateway deleted successfully");
});

// app API routes

exports.PaymentGetWayList = asyncHandler(async (req, res, next) => {
 const result = await PaymentGetWay.find();
 return giveresponse(res, 200, true, "data get success.", result);
});
