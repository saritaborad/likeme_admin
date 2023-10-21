const User = require("../models/User");
const Country = require("../models/Country");
const PaymentGateway = require("../models/PaymentGateway");
const Gift = require("../models/Gift");
const CoinPlan = require("../models/Subscription");
const Redeem = require("../models/Redeem");
const Message = require("../models/Message");
const Video = require("../models/Video");
const Images = require("../models/Image");
const Report = require("../models/Report");
const App = require("../models/App");
const UserGainTransactionHistory = require("../models/UserGainTransactionHistory");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const ApiFeatures = require("../utils/ApiFeatures");
const { giveresponse, asyncHandler } = require("../utils/res_help");

exports.verifyToken = asyncHandler(async (req, res) => {
 const { authtoken } = req.body;
 const user = jwt.verify(authtoken, process.env.JWT_SECRET);
 return giveresponse(res, 200, true, "token verified", { user: user.id, is_agent: user.is_agent, is_tester: user.is_tester });
});

exports.register = asyncHandler(async (req, res, next) => {
 const { identity, deviceType, loginType, deviceToken, fullName, package_name, email, one_signal_id, gender } = req.body;

 const date = new Date();
 const auth_token = jwt.sign({ identity, date }, process.env.JWT_SECRET);

 let user = await User.findOne({ identity });
 let result = await App.findOne({ type: 1 }).select("default_diamond");

 if (!user) {
  user = new User({ identity, loginType, deviceToken, package_name, deviceType, fullName, email, diamond: package_name !== "com.likeme.makematchcall" ? diomand : 0, one_signal_id, auth_token, gender: gender || "" });
  await user.save();

  user = await User.findOne({ identity }).populate("country_data images video");
  const result = await User.findOne({ identity }).select("-_id -__v");
  const intrests = result.intrests ? JSON.parse(result.intrests) : [];
  result.intrests = intrests;

  return giveresponse(res, 200, true, "User registered", user);
 } else {
  await User.updateOne({ identity }, { loginType, deviceType, deviceToken, package_name, one_signal_id, auth_token });

  user = await User.findOne({ identity }).select("-password");
  return giveresponse(res, 400, false, "User already registered");
 }
});

exports.logOut = asyncHandler(async (req, res, next) => {
 const result = await User.findOne({ _id: req.body.user_id });
 result.deviceToken = null;
 result.one_signal_id = "";
 if (result) return giveresponse(res, 200, true, "device logout success.");
});

exports.fetchAllUser = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(User.find().populate("images").select("fullName identity is_fake _id is_block profileimages diamond"), req.body?.options).search().sort().pagination();
 const users = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments();
 return giveresponse(res, 200, true, "All User get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, users });
});

exports.AddCoin = asyncHandler(async (req, res) => {
 const { _id, diamond } = req.body;
 const user = await User.findByIdAndUpdate({ _id }, { $inc: { diamond } }, { new: true });
 return giveresponse(res, 200, true, "Coin added success");
});

exports.userblock = asyncHandler(async (req, res, next) => {
 await User.updateOne({ _id: req.body._id }, { $set: { is_block: req.body.is_block } });
 return giveresponse(res, 200, true, `User ${req.body.is_block == 1 ? "block" : "unblock"} success`);
});

exports.updateUserCallStatus = asyncHandler(async (req, res, next) => {
 const { my_user_id, call_status, to_user_id } = req.body;

 const myUser = await User.findOne({ my_user_id });
 if (!myUser) return giveresponse(res, 404, false, "User doesn't exist");
 let toUser = null;

 if (to_user_id) {
  toUser = await User.findOne({ my_user_id: to_user_id });

  if (!toUser) return giveresponse(res, 404, false, "To user not found!");
 }

 if (toUser) {
  const intrests = await User.findById(to_user_id).select("intrests");
  toUser.intrests = intrests.intrests;
 }

 if ((!toUser && myUser.call_status === 0) || !toUser) {
  myUser.call_status = parseInt(call_status);
  await myUser.save();
 }

 const myUserIntrests = await User.findById(my_user_id).select("intrests");
 myUser.intrests = myUserIntrests.intrests;
 return giveresponse(res, 200, true, "Call Status updated successfully!", { my_user: myUser, to_user: toUser });
});

exports.multiUser = asyncHandler(async (req, res, next) => {
 const string = req.body.id;
 const arr = string.split(",");
 const result = await User.find({ _id: { $in: arr } });
 if (result.length > 0) {
  return giveresponse(res, 200, true, "Data updated", result);
 } else {
  return giveresponse(res, 404, false, "Data not found", []);
 }
});

exports.diamondPlus = asyncHandler(async (req, res) => {
 const { gain_type, user_id, type, diamond } = req.body;
 const user = await User.findOne({ _id: user_id });

 if (type == 2) {
  const gain = new UserGainTransactionHistory({ type: gain_type, user_id, diamond });
  await gain.save();
 }
 user.diamond += diamond;
 if (type == 1) {
  user.total_diamond += diamond;
  await user.save();
  return giveresponse(res, 200, true, "coin increment successfull !", { diamond: user.diamond });
 }
 await user.save();
 return giveresponse(res, 200, true, "coin increment successfull !", { diamond: user.diamond });
});

exports.diamondMinus = asyncHandler(async (req, res) => {
 const { user_id, host_id, diamond, spend_type } = req.body;

 const user = await User.findOne({ _id: user_id });

 if (user.diamond < diamond) {
  return giveresponse(res, 400, false, "Insufficient coin", { diamond: user.diamond });
 } else {
  const totalDiamond = user.diamond - diamond;
  await User.updateOne({ id: user_id }, { diamond: totalDiamond });

  const spend = new UserSpendTransactionHistory({ type: spend_type, send_by: user_id, received_by: host_id, diamond: diamond });
  await spend.save();

  // Add diamonds to the host's balance using the diamondPlus function (assuming it's defined elsewhere)
  req.body.user_id = host_id;
  req.body.type = 1;
  await diamondPlus(req.body); // Call for adding diamonds to the host's id

  return giveresponse(res, 200, true, "Coin minus success", { diamond: totalDiamond });
 }
});

exports.remove_from_save = asyncHandler(async (req, res) => {
 const user = await User.findOne({ _id: req.body.user_id });
 const saveProfileArray = user.save_profile;
 const updatedArray = saveProfileArray.filter((item) => item !== req.body.host_id);
 user.save_profile = updatedArray;
 await user.save();
 return giveresponse(res, 200, true, "Removed from saved successfully!");
});

exports.userProfileUpdate = asyncHandler(async (req, res, next) => {
 const { user_id, fullName } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 400, false, "User doesn't exist!", null);

 user.fullName = fullName;

 if (req.file) {
  const unlinkPath = path.join(__dirname, "public", user.profileimages);
  if (fs.existsSync(unlinkPath) && user.profileimages !== null) {
   fs.unlinkSync(unlinkPath);
  }
  user.profileimages = req.file.path.replace("public/", "");
 }

 await user.save();

 const result = await User.findOne({ _id: user_id }).populate("video images country_data");

 if (result) return giveresponse(res, 200, true, "Data updated", result);
});

exports.delete_profile = asyncHandler(async (req, res) => {
 const { user_id } = req.body;

 const user_data = await User.findById(user_id);
 const videos = await Video.find({ user_id });

 if (!user_data) return giveresponse(res, 404, false, "User not found");

 let result = true;

 if (user_data.profileimages) {
  const profileImagePath = "/var/www/html/app.codim.co.in/likeme/" + user_data.profileimages;
  if (fs.existsSync(profileImagePath)) {
   fs.unlinkSync(profileImagePath);
  }
 }

 const user_image_data = await Images.find({ user_id });

 for (const image of user_image_data) {
  if (image.image) {
   const imagePath = "/var/www/html/app.codim.co.in/likeme/" + image.image;
   if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
   }
  }
 }

 for (const video of videos) {
  if (video.video) {
   const videoPath = "/var/www/html/app.codim.co.in/likeme/" + video.video;
   if (fs.existsSync(videoPath)) {
    fs.unlinkSync(videoPath);
   }
  }
 }

 await User.deleteOne({ _id: user_id });

 return giveresponse(res, 200, true, "Profile deleted successfully", result);
});

exports.onOff_video_call = asyncHandler(async (req, res) => {
 const { user_id, is_video_call } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exists!");
 user.is_video_call = is_video_call;
 user.save();
 return giveresponse(res, 200, true, "is_video_call field updated!");
});

exports.fetchDashboardCount = asyncHandler(async (req, res) => {
 const allUsers = await User.find().select("is_host is_block is_fake");

 const hostApps = allUsers.filter((item) => item.is_block == 0 && item.is_host == 1).length;
 const blockHost = allUsers.filter((item) => item.is_host == 2 && item.is_block == 1).length;
 const hosts = allUsers.filter((item) => item.is_host == 2 && item.is_fake == 0).length;
 const users = allUsers.length;
 // is_block: 0, is_host: 1 // host apps
 const reports = await Report.countDocuments();
 const countries = await Country.countDocuments();
 const gatway = await PaymentGateway.countDocuments();
 const gifts = await Gift.countDocuments();
 const coinPlans = await CoinPlan.countDocuments();
 const redeem = await Redeem.countDocuments();
 const fakeMsg = await Message.countDocuments();
 return giveresponse(res, 200, true, "dashboard count get success!", { users, hostApps, blockHost, hosts, reports, countries, redeem, gatway, fakeMsg, coinPlans, gifts });
});

exports.fetchAgentDashboard = asyncHandler(async (req, res) => {
 const allUsers = await User.find({ agent_id: req.body?._id }).select("is_host is_block is_fake");
 const hosts = allUsers.filter((item) => item.is_host == 2 && item.is_fake == 0)?.length;
 const hostApps = allUsers.filter((item) => item.is_host == 1 && item.is_block == 0)?.length;
 return giveresponse(res, 200, true, "agent dashboard get success!", { hosts, hostApps });
});

// --------------- android api --------------------

exports.getUserProfile = asyncHandler(async (req, res) => {
 const result = await User.findOne({ _id: req.body.user_id }).populate("video images country_data");
 if (!result) return giveresponse(res, 404, false, "User not found!");

 result.intrests = JSON.parse(result.intrests);
 return giveresponse(res, 200, true, "Data fetch success!", result);
});

exports.interestedCountry = asyncHandler(async (req, res) => {
 const { user_id, country_list } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");
 user.interested_country = JSON.parse(country_list);
 user.save();
 return giveresponse(res, 200, true, "country updated successfully!");
});

exports.userlanguage = asyncHandler(async (req, res) => {
 const { user_id, language } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found!");
 user.language = language;
 user.save();
 return giveresponse(res, 200, true, "Language updated successfully!");
});

exports.fetchHost_historyAPI = asyncHandler(async (req, res) => {
 const { id, payment } = req.body;

 const paymentFilter = payment !== "0" ? { host_paided: payment } : {};

 const gift = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: parseInt(id), Type: 1, ...paymentFilter } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const call = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: parseInt(id), Type: 2, ...paymentFilter } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const stream = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: parseInt(id), Type: 3, ...paymentFilter } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const chat = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: parseInt(id), Type: 4, ...paymentFilter } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const match = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: parseInt(id), Type: 5, ...paymentFilter } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const giftTotal = gift.length > 0 ? gift[0].total : 0;
 const callTotal = call.length > 0 ? call[0].total : 0;
 const streamTotal = stream.length > 0 ? stream[0].total : 0;
 const chatTotal = chat.length > 0 ? chat[0].total : 0;
 const matchTotal = match.length > 0 ? match[0].total : 0;
 const grandTotal = giftTotal + callTotal + streamTotal + chatTotal + matchTotal;

 const json_data = {
  gift: giftTotal,
  call: callTotal,
  stream: streamTotal,
  chat: chatTotal,
  match: matchTotal,
  grand: grandTotal,
 };

 return giveresponse(res, 200, true, "Host history get success!", json_data);
});

exports.save_profile = asyncHandler(async (req, res) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist");
 if (user.save_profile.includes(host_id)) return giveresponse(res, 200, true, "User has already saved this profile!");

 user.save_profile.push(host_id);
 await user.save();
 return giveresponse(res, 200, true, "Profile saved successfully!");
});

exports.get_saved_profile = asyncHandler(async (req, res) => {
 const { user_id, start, limit } = req.query;

 const user = await User.findOne({ _id: user_id });

 if (!user) return giveresponse(res, 404, false, "User not found!");

 if (user.save_profile.length === 0) return giveresponse(res, 404, false, "No saved data found");

 const idsToRetrieve = user.save_profile.slice(start, start + limit);

 const userData = await User.find({ id: { $in: idsToRetrieve }, is_block: 0 }).populate("video images country_data");

 if (!userData) return giveresponse(res, 200, true, "Data not found!", []);

 const result = userData.map((res) => res.intrests);

 return giveresponse(res, 200, true, "save profile data fetch success!", result);
});

exports.updateUserCallStatus = asyncHandler(async (req, res) => {
 const { my_user_id, call_status, to_user_id } = req.body;

 if (!my_user_id || !call_status) return res.status(400).json({ status: false, message: "Invalid input data" });

 const myUser = await User.findById(my_user_id);
 let toUser;

 if (!myUser) return giveresponse(res, 404, false, "My user not found");

 if (to_user_id) {
  toUser = await User.findById(to_user_id);

  if (!toUser) return giveresponse(res, 404, false, "To user not found");

  if (toUser.call_status === 0 || !toUser.call_status) {
   myUser.call_status = parseInt(call_status, 10);
   myUser.save();
  }

  const intrests = await User.findById(to_user_id).select("intrests");
  toUser.intrests = intrests.intrests;
 }

 const intrests = await User.findById(my_user_id).select("intrests");
 myUser.intrests = intrests.intrests;

 return giveresponse(res, 200, true, "Call Status updated successfully", { my_user: myUser, to_user: toUser });
});

exports.fetchBlockList = asyncHandler(async (req, res) => {
 const { user_id } = req.body;

 const user = await User.findOne({ _id: user_id }).select("is_block_list");
 if (!user) return giveresponse(res, 404, false, "Use doesn't exists!");

 const blockList = user.is_block_list;

 const results = await User.find({ _id: { $in: blockList } }).populate("video images country_data");

 const data = results.map((res) => {
  return { res, intrests: res.intrests };
 });

 return giveresponse(res, 200, true, "List fetched successfully!", data);
});
