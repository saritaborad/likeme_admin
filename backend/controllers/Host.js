const User = require("../models/User");
const Report = require("../models/Report");
const Image = require("../models/Image");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const ApiFeatures = require("../utils/ApiFeatures");
const Video = require("../models/Video");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const { generateThumb, deleteFile } = require("../utils/commonFunc");

exports.blockUnblockHost = asyncHandler(async (req, res) => {
 const { user_id, is_block } = req.body;
 const user = await User.findOneAndUpdate({ _id: user_id }, { $set: { is_block: req.body.is_block } }, { new: true });
 if (!user) return giveresponse(res, 404, false, "Host doesn't exists!", null);
 return giveresponse(res, 200, true, `${is_block == 1 ? "Blocked" : "Unblocked"} Successfully!`);
});

exports.hostDetail = asyncHandler(async (req, res, next) => {
 const user = await User.find({ _id: req.body.id, is_host: 1, is_block: 0 });
 return giveresponse(res, 200, true, "Host detail get success.", user);
});

exports.addHostImages = asyncHandler(async (req, res, next) => {
 if (req.files && req.files.length > 0) {
  for (const img of req.files) {
   const image = new Image({ image: img.path, user_id: req.body._id });
   await image.save();
  }
  return giveresponse(res, 200, true, "Added Successfully !");
 } else {
  return giveresponse(res, 400, false, "No images provided.");
 }
});

exports.addHostVideos = asyncHandler(async (req, res, next) => {
 const { video_link, is_one_to_one, _id } = req.body;
 if (!req.files || req.files.length === 0) return giveresponse(res, 400, false, "No videos provided.");

 for (const video of req.files) {
  const thumbnailPath = path.join("uploads/thumbnail/" + file.filename.split(".")[0] + ".jpg");
  const thumbName = file.filename.split(".")[0] + ".jpg";
  generateThumb(video.path, thumbName);
  const it = new Video({ video_link, is_one_to_one, user_id: _id, video: video.path, thumbnail_image: thumbnailPath });
  await it.save();
 }

 return giveresponse(res, 200, true, "Videos added successfully");
});

exports.deleteHostById = asyncHandler(async (req, res, next) => {
 const images_all = await Image.find({ user_id: req.body._id });
 const videos_all = await Video.find({ user_id: req.body._id });

 for (const image of images_all) {
  deleteFile(image.image);
  await Image.findByIdAndDelete({ _id: image._id });
 }

 for (const video of videos_all) {
  deleteFile(video.video);
  deleteFile(video.thumbnail_image);
  await Video.findByIdAndDelete({ _id: video._id });
 }

 await User.findByIdAndDelete({ _id: req.body._id });
 return giveresponse(res, 200, true, "Host deleted successfully");
});

exports.hostUpdate = asyncHandler(async (req, res, next) => {
 const { _id, fullName, agent_id, age, bio, billingAddress, about, country_id, availabiltyHours, email, diamond_per_min, intrests } = req.body;
 const result = await User.updateOne({ _id }, { $set: { fullName, agent_id, age, intrests: intrests.replace(/ /g, "").split(","), bio, billingAddress, about, country_id, availabiltyHours, email, diamond_per_min } });

 if (req.files) {
  for (const video of req.files.video) {
   const thumbnailPath = path.join("uploads/thumbnail/" + file.filename.split(".")[0] + ".jpg");
   const thumbName = file.filename.split(".")[0] + ".jpg";
   generateThumb(video.path, thumbName);
   const it = new Video({ video: video.path, user_id: _id, thumbnail_image: thumbnailPath });
   await it.save();
  }

  for (const img of req.files.images) {
   const it = new Image({ image: img.path, user_id: _id });
   await it.save();
  }
 }

 if (result) return giveresponse(res, 200, true, "Host updated successfully");
});

exports.featureUpdate = asyncHandler(async (req, res) => {
 const user = await User.findOneAndUpdate({ _id: req.body._id }, { $set: { is_feature: req.body.is_feature } }, { new: true });
 return giveresponse(res, 200, true, "Feature updated successfully!", { is_feature: user.is_feature });
});

// host block in report module
exports.hostblock = asyncHandler(async (req, res, next) => {
 await Report.deleteMany({ user_id: req.body._id });
 await User.updateOne({ _id: req.body._id }, { $set: { is_block: 1 } });
 return giveresponse(res, 200, true, "Host block success.");
});

exports.makeHost = asyncHandler(async (req, res, next) => {
 const userDetail = await User.findOneAndUpdate({ _id: req.body._id }, { $set: { is_host: 2 } }, { new: true });
 return giveresponse(res, 200, true, "Make host successfully!", userDetail);
});

exports.fetchHosts_agent = asyncHandler(async (req, res, next) => {
 const agentId = req.session.agent_id;
 let query = { agent_id: agentId, is_host: 2, is_fake: 0, is_block: 0 };
 const apiFeature = new ApiFeatures(User.find(query), req.body).search().sort().pagination();
 const users = apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments(query);

 let data = [];
 for (const user of users) {
  const imagedata = await Images.findOne({ user_id: user.id });

  let user_profile;
  if (!imagedata) {
   user_profile = '<tr><td><img alt="image" src="public/assets/img/default.png" width="50" height="50"></td>';
  } else {
   user_profile = `<tr><td><img alt="image" src="public/storage/${imagedata.image}" width="50" height="50"></td>`;
  }

  const status = user.is_block === 1 ? '<span class="badge badge-pill badge-danger badge-shadow">Blocked</span>' : '<span class="badge badge-pill badge-success badge-shadow">Allowed</span>';

  const summary = `<a href="host_summary/${user.id}" class="is_host btn mx-2 btn-warning text-white mr-2" rel="${user.id}">Summary</a>`;
  const view = `<a href="host_history/${user.id}" class="is_host btn btn-info text-white mr-2" rel="${user.id}">History</a>`;
  const buttons = `${summary}${view}`;

  data.push([user_profile, user.fullName, user.identity, status, user.total_diamond, user.diamond, buttons]);
 }

 return giveresponse(res, 200, true, "Fetch host agent success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.fetchHosts = asyncHandler(async (req, res, next) => {
 let query = { is_host: 2, is_fake: 0, ...req.body?.filter };
 const apiFeature = new ApiFeatures(User.find(query).populate("images").select("profileimages is_block _id fullName identity is_feature total_diamond diamond_per_min email country_id about billingAddress bio age intrests availabiltyHours agent_id version"), req.body?.options).search().sort().pagination();
 const hosts = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments(query);
 return giveresponse(res, 200, true, "fetch host success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, hosts });
});

exports.fetchAllFakeHost = asyncHandler(async (req, res, next) => {
 let query = { is_host: 2, is_fake: 1, is_block: 0 };
 const apiFeature = new ApiFeatures(User.find(query).populate("images").select("_id fullName identity"), req.body).search().sort().pagination();
 const fakeHosts = await apiFeature.query;
 apiFeature.totalRecord = await User.countDocuments(query);
 return giveresponse(res, 200, true, "Fake host fetch success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, fakeHosts });
});

exports.hostById = asyncHandler(async (req, res, next) => {
 const data = await User.findOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "host fetch success", data);
});

// ------------------------ android api routes ----------------

exports.applyForHost = asyncHandler(async (req, res, next) => {
 const { id, availabiltyHours, billingAddress, bio, intrests, about, age, email, country_id, diamond_per_min, fullName } = req.body;

 const user = await User.findOne({ _id: id }).populate("images video");

 if (!user) return giveresponse(res, 404, false, "User not found!");
 if (user.is_host == 2) return giveresponse(res, 400, false, "User is already a host!");
 if (user.is_host == 1) return giveresponse(res, 400, false, "User has already applied for host!");

 const intrestsArray = intrests.split(",").map((interest) => interest.trim());

 if (req.files && req.files.length > 0) {
  for (const file of req.files) {
   if (file.fieldname == "images") {
    const it = new Image({ image: file.path, user_id: id });
    await it.save();
   }

   if (file.fieldname == "video") {
    const videoPath = file.path;
    const thumbnailPath = path.join("uploads/thumbnail/" + file.filename.split(".")[0] + ".jpg");
    const thumbName = file.filename.split(".")[0] + ".jpg";
    generateThumb(videoPath, thumbName);
    const it = new Video({ user_id: id, video: videoPath, thumbnail_image: thumbnailPath });
    await it.save();
   }
  }
 }

 await user.updateOne({ availabiltyHours, billingAddress, bio, intrests: intrestsArray, about, age, email, country_id, diamond_per_min, is_host: 1, fullName });

 return giveresponse(res, 200, true, "Request submitted", user);
});

exports.get_host_profile = asyncHandler(async (req, res, next) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exists!", null);
 let host_detail = await User.findOne({ _id: host_id })
  .populate({ path: "video", match: { is_one_to_one: 0 } })
  .populate("images")
  .populate("country_data");

 if (!host_detail) return giveresponse(res, 404, false, "Host doesn't exist", []);
 const followers = await User.find({ is_host: 0, is_block: 0, save_profile: { $in: host_detail._id } }); // find unblocked user whose profile is stored in save_profile to get follower

 const data = { ...host_detail._doc, ...host_detail.$$populatedVirtuals, followers_count: followers.length, intrests: host_detail.intrests };
 return giveresponse(res, 200, true, "Data fetched successfully!", data);
});

exports.get_host_profile_one_to_one = asyncHandler(async (req, res, next) => {
 const { host_id } = req.body;
 const user = await User.findOne({ _id: host_id });
 if (!user) return giveresponse(res, 404, false, "Host doesn't exist");
 const host_one_to_one = await Video.find({ user_id: host_id, is_one_to_one: 1 });
 if (host_one_to_one.length == 0) return giveresponse(res, 404, false, "Host doesn't exists", []);
 return giveresponse(res, 200, true, "Data fetch success!", host_one_to_one);
});

exports.fetchHost_historyAPI = asyncHandler(async (req, res) => {
 const payment = parseInt(req.body.payment);

 const matchStage = { received_by: new ObjectId(req.body.id), type: { $in: [1, 2, 3, 4, 5] } };

 if (payment != 0) matchStage.host_paided = payment;
 const pipeline = [{ $match: matchStage }, { $group: { _id: "$type", total: { $sum: "$diamond" } } }];

 const result = await UserSpendTransactionHistory.aggregate(pipeline);
 const typeTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
 result.forEach((item) => (typeTotals[item._id] = item.total));
 const grandTotal = Object.values(typeTotals).reduce((total, value) => total + value, 0);
 const data = { gift: typeTotals[1], call: typeTotals[2], stream: typeTotals[3], chat: typeTotals[4], match: typeTotals[5], total: grandTotal };

 return giveresponse(res, 200, true, "Host history API get success.", data);
});

exports.fetchHostProfiles = asyncHandler(async (req, res, next) => {
 const { user_id, country_id, is_fake } = req.body;
 const user = await User.findOne({ _id: user_id });

 if (!user) return giveresponse(res, 404, false, "User doesn't exist!", null);

 let blockhost = [];
 if (user.is_block_list) blockhost = user.is_block_list;

 let query = { is_host: 2, is_block: 0, _id: { $nin: [user_id, ...blockhost] } };

 if (country_id != 0) query.country_id = country_id;
 if (!is_fake) query.is_fake = 0;

 let results = await User.find(query).populate("video").populate("images").populate("country_data").limit(100);
 if (results.length > 0) return giveresponse(res, 200, true, "Data fetched successfully!", results);
});

exports.fetchHost_name = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const user = await User.findById(_id);

 if (!user) return giveresponse(res, 404, false, "User not found");
 const json_data = [user.fullName, user.profileimages];
 return giveresponse(res, 200, true, "Host name get success.", json_data);
});

exports.fetchPayout = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const paid = await UserSpendHistory.aggregate([{ $match: { received_by: _id, host_paided: 2 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);
 const unpaid = await UserSpendHistory.aggregate([{ $match: { received_by: _id, host_paided: 1 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

 const json_data = [paid[0]?.total || 0, unpaid[0]?.total || 0];
 return giveresponse(res, 200, true, "Payout data get success.", json_data);
});

exports.fetchAgentSubtotal = asyncHandler(async (req, res, next) => {
 const subtotal = await User.aggregate([{ $match: { agent_id: req.session.agent_id } }, { $group: { _id: null, totalDiamonds: { $sum: "$diamond" } } }]);

 return giveresponse(res, 200, true, "Agent subtotal get success.", subtotal[0].totalDiamonds.toString());
});

exports.fetchHostWorkhistory = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const apiFeature = new ApiFeatures(UserSpendTransactionHistory.find({ received_by: _id }), req.body).search().sort().pagination();
 let history = await apiFeature.query;
 apiFeature.totalRecord = await UserSpendTransactionHistory.countDocuments({ received_by: _id });
 return giveresponse(res, 200, true, "All host history get success.", { totalRecord: apiFeature.totalRecord, history, totalPage: apiFeature.totalPage });
});

exports.fetchAllHost_historyExport = asyncHandler(async (req, res, next) => {
 const { _id } = req.body;
 const apiFeature = new ApiFeatures(Transaction.find({ received_by: _id }), req.body).search().sort().pagination();
 const history = await apiFeature.query;
 apiFeature.totalRecord = await Transaction.countDocuments({ received_by: _id });

 const data = history.map((historys) => {
  const spendIn = ["gift", "call", "stream", "chat", "match"][historys.type - 1];
  const status = historys.host_paided === 1 ? "Unpaid" : "Paid";
  return { spendIn, user: historys.user.fullName, host: historys.host.fullName, diamond: historys.diamond, status, created_at: historys.created_at };
 });

 return giveresponse(res, 200, true, "all host history get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data });
});

exports.find_random_host = asyncHandler(async (req, res) => {
 const { user_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");

 let blockHost = [];
 if (user.is_block_list) blockHost = user.is_block_list;

 const result = await User.findOne({ is_host: 2, is_block: 0, _id: { $nin: [user_id, ...blockHost] } })
  .populate("video")
  .populate("images")
  .populate("country_data");
 if (result.length === 0) return giveresponse(res, 400, false, "No hosts found!");
 return giveresponse(res, 200, true, "Data fetched successfully!", result);
});

exports.hostProfileUpdate = asyncHandler(async (req, res, next) => {
 const { user_id, intrests, availabiltyHours, billingAddress, bio, about, age, email, country_id, fullName, diamond_per_min, image_id, video_id } = req.body;

 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");
 const intrestsArray = intrests.split(",").map((item) => item.trim());
 const updateData = { availabiltyHours, billingAddress, bio, intrests: intrestsArray, about, age, email, country_id, fullName, diamond_per_min };
 await User.updateOne({ _id: user_id }, updateData);

 // Delete Images
 const imageIds = image_id.split(",").map((item) => item.trim());

 for (const id of imageIds) {
  const image = await Image.findById({ _id: id });
  deleteFile(image.image);
  await Image.deleteOne({ _id: id });
 }

 // Delete Videos
 const videoIds = video_id.split(",").map((item) => item.trim());

 for (const id of videoIds) {
  const video = await Video.findById({ _id: id });
  deleteFile(video.video);
  deleteFile(video.thumbnail_image);
  await Video.deleteOne({ _id: id });
 }

 for (const file of req.files) {
  if (file.fieldname == "images") {
   const it = new Image({ image: file.path, user_id });
   await it.save();
  }

  if (file.fieldname == "video") {
   const thumbnailPath = path.join("uploads/thumbnail/" + file.filename.split(".")[0] + ".jpg");
   const thumbName = file.filename.split(".")[0] + ".jpg";
   generateThumb(file.path, thumbName);
   const it = new Video({ user_id, video: file.path, thumbnail_image: thumbnailPath });
   await it.save();
  }
 }

 const updatedUser = await User.findById({ _id: user_id }).populate("video").populate("images").populate("country_data");
 if (updatedUser) return giveresponse(req, 200, true, "Data updated", updatedUser);
});

exports.fetchHostProfiles_one_to_one = asyncHandler(async (req, res, next) => {
 const results = await User.find({ is_host: 2, is_block: 0 })
  .populate({ path: "video", match: { is_one_to_one: 1 } })
  .populate("images")
  .populate("country_data");

 const filteredResults = results.filter((user) => user.video.length > 0);
 if (filteredResults.length == 0) return giveresponse(res, 400, false, "Data not found!");
 return giveresponse(res, 200, true, "Data fetched successfully!", filteredResults);
});

exports.blockHost = asyncHandler(async (req, res, next) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found");
 user.is_block_list = user.is_block_list || [];
 if (user.is_block_list.includes(host_id)) return giveresponse(res, 400, false, "This host is already blocked");
 user.is_block_list.push(new ObjectId(host_id));
 await user.save();
 return giveresponse(res, 200, true, "Host blocked successfully!");
});

exports.unblockHost = asyncHandler(async (req, res, next) => {
 const { user_id, host_id } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found");
 if (!user.is_block_list.includes(host_id)) return giveresponse(res, 400, false, "Host is not in the block list");
 user.is_block_list = user.is_block_list.filter((id) => id != host_id);
 await user.save();
 return giveresponse(res, 200, true, "Host unblocked successfully");
});

exports.fetchHostProfilesNew = asyncHandler(async (req, res, next) => {
 const { user_id, country_id, is_fake, skip, limit } = req.body;
 const user = await User.findOne({ _id: user_id });
 if (!user) return giveresponse(res, 404, false, "User not found");

 let results = [];
 let blockhost = [];

 if (user.is_block_list !== null) blockhost = user.is_block_list;

 const query = { is_host: 2, is_block: 0, _id: { $nin: [user_id, ...blockhost] } };
 if (country_id != 0) query.country_id = country_id;
 if (is_fake) query.is_fake = 0;

 results = await User.find(query).populate("images").skip(skip).limit(limit);

 if (results) return giveresponse(res, 200, true, "Data fetched successfully!", results);
});
