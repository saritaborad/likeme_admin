const { asyncHandler, giveresponse } = require("../utils/res_help");
const Admob = require("../models/Admob");

exports.getAdmobData = asyncHandler(async (req, res) => {
 const admob = await Admob.find();
 return giveresponse(res, 200, true, "Admob data get success", admob);
});

exports.updateSettingAdmob = asyncHandler(async (req, res) => {
 const { id, intersial_id, native_id, banner_id, rewarded_id } = req.body;
 const result = await Admob.updateOne({ id }, { $set: { intersial_id, native_id, banner_id, rewarded_id } });
 return giveresponse(res, 200, true, "Data is updated Admob", result);
});
