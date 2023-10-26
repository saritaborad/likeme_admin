const Agents = require("../models/Agent");
const Redeem = require("../models/Redeem");
const User = require("../models/User");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const ApiFeatures = require("../utils/ApiFeatures");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const App = require("../models/App");
const Agent = require("../models/Agent");
const HostLiveStreamTrack = require("../models/HostLiveStreamTrack");
const NotificationPackagename = require("../models/NotificationPackagename");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

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

//------------------------- android api route ------------------

exports.fetchRedeemRequests = asyncHandler(async (req, res, next) => {
 const { user_id, start, limit } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");
 const redeem = await Redeem.find({ user_id: user_id }).sort({ _id: -1 }).skip(parseInt(start)).limit(parseInt(limit));
 return giveresponse(res, 200, true, "Redeem Request get successfully!", redeem);
});

exports.placeRedeemRequest = asyncHandler(async (req, res, next) => {
 placeRedeem(req, res);
 return giveresponse(res, 200, true, "Redeem Request added successfully!");
});

exports.placeRedeemRequestAll = asyncHandler(async (req, res, next) => {
 const agents = await Agents.find({ status: 1, is_deleted: 0 });

 for (const agent of agents) {
  const hosts = await User.find({ agent_id: agent._id, is_host: 2, is_block: 0 });

  for (const host of hosts) {
   const hostStatus = await UserSpendTransactionHistory.countDocuments({ received_by: host._id, type: 2, createdAt: { $gt: moment().subtract(14, "days").toDate() } });
   if (hostStatus > 0) {
    (req.body.user_id = host._id), (req.body.account_info = "1"), (req.body.payment_getway_title = "1"), (req.body.agent_id = agent._id), await placeRedeem(req, res);
   } else {
    await User.findOneAndUpdate({ _id: host._id }, { is_block: 1 }, { new: true });
   }
  }
 }

 return giveresponse(res, 200, true, "Reedem Request processed successfully!");
});

const placeRedeem = asyncHandler(async (req, res) => {
 const { user_id, account_info, payment_getway_title, agent_id, diamond } = req.body;
 const user = await User.findOne({ _id: user_id });

 if (!user) return giveresponse(res, 404, false, "User doesn't exist");

 const packageNames = await NotificationPackagename.find();
 let itrate = 0;

 for (const package of packageNames) {
  const DaysAgo = moment().subtract(15, "days");
  // redeem means to convert diamond worth into cash
  const dimnodRedeem = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: new ObjectId(user_id), package_name: package.package_name, host_paided: 1, createdAt: { $lte: DaysAgo.toDate() } } }, { $group: { _id: null, diamond: { $sum: "$diamond" } } }]);

  await UserSpendTransactionHistory.updateMany({ received_by: user_id, package_name: package.package_name, host_paided: 1, createdAt: { $lte: DaysAgo.toDate() } }, { $set: { host_paided: 2 } });

  if (itrate === 0) {
   itrate = 1;

   const agents = await Agents.findOne({ _id: agent_id });
   const stream_minits = agents.stream_minits;
   const stream_rate = agents.stream_rate;
   const coins = agents.coins;
   const coins_rate = agents.coins_rate;

   const streamTracks = await HostLiveStreamTrack.aggregate([{ $match: { host_id: user_id, start: { $gte: DaysAgo.toDate() } } }, { $group: { _id: { host_id: "$host_id", date: { $dateToString: { format: "%Y-%m-%d", date: "$start" } } }, count: { $sum: 1 }, time_diff: { $sum: { $divide: [{ $subtract: ["$end", "$start"] }, 60000] } } } }, { $match: { time_diff: { $gt: stream_minits * 60 } } }]);

   const myRandomString = "DIM" + Math.random().toString(36).substring(7).toUpperCase();
   const redeem = new Redeem({ user_id, account_info, diamond: dimnodRedeem[0]?.diamond || 0, payment_getway_title, redeem_token: myRandomString, stream_days: streamTracks.length, stream_minits, stream_rate, coins, coins_rate, package_name: package.package_name });
   await redeem.save();
  } else {
   const myRandomString = "DIM" + Math.random().toString(36).substring(7).toUpperCase();
   const redeem = new Redeem({ user_id, account_info, diamond: dimnodRedeem[0]?.diamond || 0, payment_getway_title, redeem_token: myRandomString, package_name: package.package_name });
   await redeem.save();
  }

  if (user.diamond < diamond) return giveresponse(res, 400, false, "Insufficient balance to redeem!");
  user.diamond -= dimnodRedeem[0]?.diamond || 0;
  await user.save();
 }
});
