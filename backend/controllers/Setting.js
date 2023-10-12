const Admob = require("../models/Admob");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const App = require("../models/App");

exports.getSettingData = asyncHandler(async (req, res, next) => {
 const data = await App.findOne();
 return giveresponse(res, 200, true, "setting data get success", data);
});

exports.updateSettingApp = asyncHandler(async (req, res, next) => {
 const { app_name, default_diamond, amount_per_diamond, currency, min_threshold, min_diamonds_charge_for_going_live, watch_ad_diamond, user_message_charge, host_message_charge, host_call_charge, host_live_Percentage, minimumMinuts, chargeForLive, max_live_time, max_live_private_time, agora_app_id, agora_app_cert, _id, match_call_coin, match_call_second, max_fake_live_hosts, fake_host_vidoe_from, liveSwitch } = req.body;
 const result = await App.updateOne({ _id }, { $set: { app_name, default_diamond, amount_per_diamond, currency, min_threshold, min_diamonds_charge_for_going_live, watch_ad_diamond, user_message_charge, agora_app_id, agora_app_cert, host_message_charge, host_call_charge, host_live_Percentage, minimumMinuts, chargeForLive, max_live_time, max_live_private_time, match_call_coin, match_call_second, max_fake_live_hosts, fake_host_vidoe_from, liveSwitch } });
 return giveresponse(res, 200, true, "settings updated");
});

exports.all_setting = asyncHandler(async (req, res, next) => {
 const appResult = await App.findOne();
 const admobResult = await Admob.find();

 return giveresponse(res, 200, true, "Data fetched successfully!", { app: appResult, android: admobResult[0], ios: admobResult[admobResult.length - 1] });
});

exports.getAdmob = asyncHandler(async (req, res, next) => {
 const admobData = await Admob.findOne({ type: req.body.type });
 return giveresponse(res, 200, true, "Admob data get success", admobData);
});

exports.updateAdmob = asyncHandler(async (req, res, next) => {
 const { type, rewarded_id } = req.body;
 const data = await Admob.findOneAndUpdate({ type }, { $set: { rewarded_id } }, { new: true });
 if (!data) return giveresponse(res, 404, false, "Data not found");
 return giveresponse(res, 200, true, "Data is updated", data);
});

exports.liveSwitch = asyncHandler(async (req, res, next) => {
 const result = await App.updateOne({ id: req.body.appId }, { liveSwitch: req.body.liveSwitch });

 if (result) {
  return giveresponse(res, 200, true, "Switch updated successfully.");
 } else {
  return giveresponse(res, 404, false, "App not found.");
 }
});

exports.generateAgoraToken = asyncHandler(async (req, res, next) => {
 const channelName = req.body.channelName;

 App.findOne({}, (err, result) => {
  if (err) return giveresponse(res, 500, false, "Error fetching data from database");

  const appID = result.agora_app_id;
  const appCertificate = result.agora_app_cert;
  const role = AgoraRtcTokenBuilder.Role.PUBLISHER;
  const expireTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

  const token = AgoraRtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, 0, role, privilegeExpiredTs);

  return giveresponse(res, 200, true, "Agora token generate success", token);
 });
});

exports.setting = asyncHandler(async (req, res, next) => {
 const data = await Admob.find();

 const androidAdmob = data[0];
 const iOSAdmob = data[data.length - 1];

 return giveresponse(res, 200, true, "setting get success", { androidAdmob, iOSAdmob });
});
