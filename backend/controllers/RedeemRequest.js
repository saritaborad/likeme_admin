const Agents = require("../models/Agent");
const Redeem = require("../models/Redeem");
const User = require("../models/User");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const ApiFeatures = require("../utils/ApiFeatures");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const App = require("../models/App");
const Agent = require("../models/Agent");

exports.getRedeemById = asyncHandler(async (req, res, next) => {
 const redeem = await Redeem.findOne({ _id: req.body._id }).populate("user");
 const app = App.findOne();

 if (!redeem) giveresponse(res, 404, false, "Redeem not found");

 redeem.total_amount = redeem.diamond * app.amount_per_diamond;
 return giveresponse(res, 200, true, "Redeem detail get success", redeem);
});

exports.fetchRedeems = asyncHandler(async (req, res, next) => {
 const { request_status } = req.body;
 const apiFeature = new ApiFeatures(Redeem.find({ request_status: request_status }).populate({ path: "user", select: "fullName" }), req.body).search().sort().pagination();
 const redeems = await apiFeature.query;
 apiFeature.totalRecord = await Redeem.countDocuments({ request_status: request_status });
 const result = await App.findOne({ type: 1 }).select("amount_per_diamond");

 return giveresponse(res, 200, true, "Rejected Redeems get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, redeems, amount_per_diamond: result.amount_per_diamond });
});

exports.fetchAllRedeems = asyncHandler(async (req, res, next) => {
 const { agent_id, request_status } = req.body;
 let query = { request_status: request_status || 0 };

 if (request_status == 0) {
  const agent = await Agent.find();
  const agentHost = await User.find({ agent_id: agent_id ? agent_id : agent[0]?._id, is_block: 0 })
   .sort({ _id: "desc" })
   .select("_id");
  const userIdsArray = agentHost.map((user) => user._id);
  query.user_id = { $in: userIdsArray };
 }
 const apiFeature = new ApiFeatures(Redeem.find(query).populate({ path: "user", select: "fullName" }), req.body?.options).search().sort().pagination();
 const redeemData = await apiFeature.query;
 apiFeature.totalRecord = await Redeem.countDocuments(query);

 const data = [];

 for (const redeem of redeemData) {
  let pay_amount = 0;
  try {
   pay_amount = (redeem.diamond / redeem.coins) * redeem.coins_rate;
  } catch (e) {
   pay_amount = 0;
  }

  const Stream_Payable = redeem.stream_days * redeem.stream_rate;
  const final_amount = Math.round(pay_amount) + Stream_Payable;

  data.push({ fullName: redeem.user?.fullName, package_name: redeem.package_name, stream_days: redeem.stream_days, stream_payable: Stream_Payable, coin: redeem.diamond, coin_payable: Math.round(pay_amount), final_amount });
 }

 return giveresponse(res, 200, true, "redeems fetch success", { data: request_status == 0 ? data : redeemData, totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage });
});

exports.rejectRedeem = asyncHandler(async (req, res, next) => {
 const redeem = await Redeem.updateOne({ _id: req.body._id }, { $set: { request_status: 2 } }, { new: true });

 if (!redeem) return giveresponse(res, 404, false, "Redeem request not found");

 const user_diomand = await User.findOne({ _id: redeem.user_id }).select("diamond");
 const diomand = user_diomand.diamond + redeem.diamond;
 const result = await User.updateOne({ _id: redeem.user_id }, { diamond: diomand });

 if (result) return giveresponse(res, 200, true, "Reject redeem success.", redeem.user_id);
});

exports.completeRedeem = asyncHandler(async (req, res, next) => {
 const result = await Redeem.updateOne({ _id: req.body._id }, { $set: { amount_paid: req.body.amount_paid, request_status: 1, completed_at: new Date() } });

 return giveresponse(res, 200, true, "amount request approved");
});

//------------------------- api route ------------------

exports.placeRedeemRequest = asyncHandler(async (req, res, next) => {
 const { user_id, account_info, payment_getway_title } = req.body;
 const user = await User.findOne({ id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");

 const dimnodRedeem = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: user_id, host_paided: 1, create_at: { $lte: new Date() } } }, { $group: { _id: null, totalDiamond: { $sum: "$diamond" } } }]);

 const resultR = await UserSpendTransactionHistory.updateMany({ received_by: user_id, host_paided: 1, create_at: { $lte: new Date() } }, { $set: { host_paided: 2 } });

 const myRandomString = "DIM" + new Date().getTime();

 const redeem = new Redeem({ user_id: user.id, account_info, diamond: dimnodRedeem.length > 0 ? dimnodRedeem[0].totalDiamond : 0, payment_getway_title, redeem_token: myRandomString });

 const result = await redeem.save();

 if (user.diamond < dimnodRedeem.totalDiamond) return giveresponse(res, 400, false, "Insufficient balance to redeem!");

 user.diamond = user.diamond - dimnodRedeem.totalDiamond;
 await user.save();

 return giveresponse(res, 200, true, "Redeem Request added successfully!");
});

exports.fetchRedeemRequests = asyncHandler(async (req, res, next) => {
 const { user_id, start, limit } = req.body;

 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");

 const redeem = await Redeem.find({ user_id: user_id }).sort({ id: -1 }).skip(parseInt(start)).limit(parseInt(limit));

 return giveresponse(res, 200, true, "Data fetched successfully!", redeem);
});

exports.placeRedeemRequestAll = asyncHandler(async (req, res, next) => {
 const agents = await Agents.find({ status: 1, is_deleted: 0 });

 for (const agent of agents) {
  const hosts = await User.find({ agent_id: agent.id, is_host: 2 });

  for (const host of hosts) {
   const redeemRequest = { user_id: host.id, account_info: "1", payment_getway_title: "1" };

   await placeRedeemRequest(redeemRequest);
  }
 }

 return giveresponse(res, 200, true, "Redeem requests placed successfully.");
});
