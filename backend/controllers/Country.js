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

exports.country_list = asyncHandler(async (req, res) => {
 const result = await Country.find();
 if (!result || result.length === 0) return giveresponse(res, 404, false, "Country data not found!");
 return giveresponse(res, 200, true, "data fetch successfully", result);
});

exports.fetchAllCountry = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Country.find({}), req.body?.options).search().sort().pagination();
 const countries = await apiFeature.query;
 apiFeature.totalRecord = await Country.countDocuments();
 return giveresponse(res, 200, true, "All Country get success.", { countries, totalPage: apiFeature.totalPage, totalRecord: apiFeature.totalRecord });
});

// exports.getAllAccountGroup = asyncHandler(async (req, res, next) => {
//  const { options } = req.body;
//  const page = options?.page + 1 || 1;
//  const limit = options?.sizePerPage || 10;
//  const column_name = options?.sort || "_id";
//  const OrderBy = options?.order == "ASC" ? 1 : -1;
//  const startIndex = (page - 1) * limit;
//  const sortData = options ? { [column_name]: OrderBy } : 0;
//  const search = options?.search || {};
//  let obj = {};
//  if (Object.keys(search).length !== 0) {
//   Object.keys(search).map((x) => {
//    if (search[x]) {
//     if (/^\+\d+-?\d+$/.test(search[x])) {
//      obj[x] = search[x];
//     } else if (/^(\d{4})[\/-](0[1-9]|1[0-2])[\/-](0[1-9]|[12][0-9]|3[01])$/.test(search[x])) {
//      obj[x] = { $gte: new Date(`${search[x]} 00:00:00 +00:00`), $lte: new Date(`${search[x]} 23:59:59 +00:00`) };
//     } else if (!isNaN(Number(search[x]))) {
//      obj[x] = Number(search[x]);
//     } else {
//      if (search[x][0] === "$") {
//       obj[x] = search[x];
//      } else {
//       obj[x] = { $regex: new RegExp(".*" + search[x] + ".*", "i") };
//      }
//     }
//    }
//   });
//  }
//  const data = await AccountGroup.aggregate([
//   {
//    $project: {
//     id: 1,
//     name: 1,
//     active: 1,
//     createdAt: 1,
//    },
//   },
//   { $match: obj },
//   { $facet: { totalRecord: [{ $count: "total" }], data: options ? [{ $sort: sortData }, { $skip: startIndex }, { $limit: limit }] : [] } },
//   { $project: { data: 1, totalRecord: { $first: "$totalRecord.total" } } },
//  ]);
//  give_response(res, 200, true, "get all Successfully", data[0]);
// });
