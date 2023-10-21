const Country = require("../models/Country");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");

exports.addCountry = asyncHandler(async (req, res, next) => {
 const { country_name } = req.body;
 const result = await Country.findOne({ country_name });
 if (result) return giveresponse(res, 404, false, "Country already exists");
 const newCountry = new Country({ country_name });
 await newCountry.save();
 return giveresponse(res, 200, true, "Country added successfully");
});

exports.updateCountry = asyncHandler(async (req, res, next) => {
 const { _id, country_name } = req.body;
 const result = await Country.updateOne({ _id: _id }, { $set: { country_name: country_name } });
 return giveresponse(res, 200, true, "Country data is updated");
});

exports.deleteCountry = asyncHandler(async (req, res, next) => {
 const result = await Country.deleteOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "Country deleted successfully.");
});

exports.fetchAllCountry = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Country.find({}), req.body?.options).search().sort().pagination();
 const countries = await apiFeature.query;
 apiFeature.totalRecord = await Country.countDocuments();
 return giveresponse(res, 200, true, "All Country get success.", { countries, totalPage: apiFeature.totalPage, totalRecord: apiFeature.totalRecord });
});

// ---------------- android api ------------------

exports.country_list = asyncHandler(async (req, res) => {
 const result = await Country.find();
 if (!result || result.length === 0) return giveresponse(res, 404, false, "Country data not found!");
 return giveresponse(res, 200, true, "data fetch successfully", result);
});
