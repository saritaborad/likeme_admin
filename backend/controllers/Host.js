const User = require("../models/User");
const Report = require("../models/Report");
const Image = require("../models/Image");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const ApiFeatures = require("../utils/ApiFeatures");
const Video = require("../models/Video");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

exports.blockUnblockHost = asyncHandler(async (req, res) => {
 const { user_id, is_block } = req.body;
 const user = await User.findOneAndUpdate({ _id: user_id }, { $set: { is_block: req.body.is_block } }, { new: true });
 if (!user) return giveresponse(res, 404, false, "Host doesn't exists!", null);
 return giveresponse(res, 200, true, `${is_block == 1 ? "Blocked" : "Unblocked"} Successfully!`);
});

exports.get_host_profile = asyncHandler(async (req, res, next) => {
 const user = await User.find({ id: req.body.user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exists!", null);
 const host_detail = await User.findOne({ id: req.body.host_id }).populate("video").populate("images").populate("country_data");
 if (!host_detail) return giveresponse(res, 404, false, "Host doesn't exist", []);
 const followers = await User.find({ is_host: 0, is_block: 0, save_profile: { $regex: host_detail.id.toString() } });
 host_detail.followers_count = followers.length;
 host_detail.intrests = JSON.parse(host_detail.intrests);
 return giveresponse(res, 200, true, "Data fetched successfully!", host_detail);
});

exports.fetchHostProfiles = asyncHandler(async (req, res, next) => {
 const { user_id, country_id } = req.body;
 const user = await User.findOne({ id: user_id });

 if (!user) return giveresponse(res, 404, false, "User doesn't exist!", null);

 let blockhost = [];
 if (user.is_block_list !== null) {
  blockhost = JSON.parse(user.is_block_list);
 }

 let query = { is_host: 2, is_block: 0, $and: [{ _id: { $ne: user_id } }, { _id: { $nin: blockhost } }] };

 if (country_id !== "0") {
  query = { is_host: 2, is_block: 0, country_id: country_id, $and: [{ _id: { $ne: user_id } }, { _id: { $nin: blockhost } }] };
 }

 let results = await User.find(query).populate("video").populate("images").populate("country_data").inRandomOrder().limit(100);

 for (const result of results) {
  const followers = await User.find({ is_host: 0, is_block: 0, save_profile: { $regex: new RegExp(result._id) } });
  result.intrests = JSON.parse(result.intrests);
  result.followers_count = followers.length;
 }

 if (results.length > 0) {
  return giveresponse(res, 200, true, "Data fetched successfully!", results);
 } else {
  return giveresponse(res, 400, false, "Data not fetched!");
 }
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
  const image = await Images.findById(id);

  if (image && fs.existsSync(`./uploads/${image.image}`)) {
   fs.unlinkSync(`./uploads/${image.image}`);
   await image.remove();
  }
 }

 // Delete Videos
 const videoIds = video_id.split(",").map((item) => item.trim());

 for (const id of videoIds) {
  const video = await Video.findById(id);

  if (video && fs.existsSync(`./uploads/${video.Video}`)) {
   fs.unlinkSync(`./uploads/${video.Video}`);
   await video.remove();
  }
 }

 // Store Images
 if (req.files && req.files.length > 0) {
  for (const img of req.files) {
   const it = new Images();
   it.image = img.filename;
   it.user_id = user_id;
   await it.save();
  }
 }

 // Store Videos
 if (req.files && req.files.length > 0) {
  for (const video of req.files) {
   const it = new Video();
   it.Video = video.filename;

   // You may need to add code here to generate a thumbnail image from the video using ffmpeg
   const videoPath = `./uploads/${video.filename}`;
   const thumbnailPath = `./uploads/${video.filename}.jpg`;

   try {
    const process = new ffmpeg(videoPath);
    process.then(
     function (video) {
      video.fnExtractFrameToJPG(thumbnailPath, function (error, files) {
       if (!error) {
        it.thumbnail_image = `${video.filename}.jpg`;
       }
      });
     },
     function (err) {
      console.log("Error: " + err);
     }
    );
   } catch (e) {
    console.log(e.code);
    console.log(e.msg);
   }

   it.user_id = user_id;
   await it.save();
  }
 }

 const updatedUser = await User.findById(user_id).populate("video").populate("images").populate("country_data");
 const intrestsResult = updatedUser.intrests.map((item) => item.trim());

 if (updatedUser) {
  return giveresponse(req, 200, true, "Data updated", { ...updatedUser.toObject(), intrests: intrestsResult });
 } else {
  return giveresponse(req, 400, false, "Data not fetched");
 }
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

 const videos = req.files;

 for (const video of videos) {
  const it = new Video({ video_link, is_one_to_one, user_id: _id, video: video.path });
  await it.save();
 }

 return giveresponse(res, 200, true, "Videos added successfully");
});

exports.deleteHostById = asyncHandler(async (req, res, next) => {
 const images_all = await Image.find({ user_id: req.body._id });
 const videos_all = await Video.find({ user_id: req.body._id });

 for (const image of images_all) {
  const imagePath = path.join(__dirname, "..", image.image);
  if (fs.existsSync(imagePath) && image.image !== null) fs.unlinkSync(imagePath);
  await Image.findByIdAndDelete({ _id: image._id });
 }

 for (const video of videos_all) {
  const videoPath = path.join(__dirname, "..", video.video);
  if (fs.existsSync(videoPath) && video.video !== null) fs.unlinkSync(videoPath);
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
   const it = new Video({ video: video.path, user_id: _id });
   await it.save();
  }

  for (const img of req.files.images) {
   const it = new Image({ image: img.path, user_id: _id });
   await it.save();
  }
 }

 if (result) return giveresponse(res, 200, true, "Host updated successfully");
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

exports.applyForHost = asyncHandler(async (req, res, next) => {
 try {
  const { id, availabiltyHours, billingAddress, bio, intrests, about, age, email, country_id, diamond_per_min, fullName } = req.body;

  // Validate request data here...

  const user = await User.findOne({ _id: id });

  if (!user) return giveresponse(res, 404, false, "User not found!");
  if (user.is_host === 2) return giveresponse(res, 400, false, "User is already a host!");
  if (user.is_host === 1) return giveresponse(res, 400, false, "User has already applied!");

  const intrestsArray = intrests.split(",").map((interest) => interest.trim());

  const submit = { availabiltyHours, billingAddress, bio, intrests: intrestsArray, about, age, email, country_id, diamond_per_min, is_host: 1, fullName };

  await user.updateOne(submit);

  if (req.files && req.files.length > 0) {
   for (const img of req.files) {
    const it = new Images();
    const imagePath = path.join("uploads", img.filename);
    it.image = imagePath;
    it.user_id = id;
    await it.save();
   }
  }

  if (req.files && req.files.length > 0) {
   for (const video of req.files) {
    const it = new Video();
    const videoPath = path.join("uploads", video.filename);

    const thumbnailPath = path.join("uploads", path.parse(video.filename).name + ".jpg");

    await new Promise((resolve, reject) => {
     ffmpeg(videoPath)
      .seekInput(10) // Specify the path to your ffmpeg binary
      .screenshots({
       count: 1,
       folder: "public",
       filename: thumbnailPath,
      })
      .on("end", () => {
       resolve();
      })
      .on("error", (err) => {
       reject(err);
      });
    });

    it.thumbnail_image = thumbnailPath;
    it.video = videoPath;
    it.user_id = id;
    await it.save();
   }
  }

  const result = await User.findOne({ _id: id }).populate("images").populate("video");
  result.intrests = intrestsArray;

  return giveresponse(res, 200, true, "Request submitted", result);
 } catch (error) {
  console.error(error);
  return giveresponse(res, 500, false, "Something went wrong!", null);
 }
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

exports.featureUpdate = asyncHandler(async (req, res) => {
 const user = await User.findOneAndUpdate({ _id: req.body._id }, { $set: { is_feature: req.body.is_feature } }, { new: true });
 return giveresponse(res, 200, true, "Feature updated successfully!", { is_feature: user.is_feature });
});

exports.find_random_host = asyncHandler(async (req, res) => {
 const { user_id } = req.body;

 const user = await User.findOne({ id: user_id });

 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");

 let blockHost = [];
 if (user.is_block_list) {
  blockHost = JSON.parse(user.is_block_list);
 }

 const result = await User.findOne({ is_host: 2, is_block: 0, _id: { $ne: mongoose.Types.ObjectId(user_id) }, _id: { $nin: blockHost.map((id) => mongoose.Types.ObjectId(id)) } })
  .populate("video")
  .populate("images")
  .populate("country_data");

 if (result.length === 0) return giveresponse(res, 400, false, "No suitable hosts found!");

 const intrests = JSON.parse(result[0].intrests);

 return giveresponse(res, 200, true, "Data fetched successfully!", { ...result[0], intrests: intrests });
});

exports.fetchHost_historyAPI = asyncHandler(async (req, res) => {
 const { id, paymet } = req.body;

 let gift, call, steram, chat, grand;

 if (paymet !== 0) {
  gift = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 1, host_paided: paymet } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  call = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 2, host_paided: paymet } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  steram = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 3, host_paided: paymet } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  chat = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 4, host_paided: paymet } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);
 } else {
  gift = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 1 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  call = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 2 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  steram = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 3 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);

  chat = await UserSpendTransactionHistory.aggregate([{ $match: { received_by: id, Type: 4 } }, { $group: { _id: null, total: { $sum: "$diamond" } } }]);
 }

 grand = gift[0]?.total + call[0]?.total + steram[0]?.total + chat[0]?.total;

 const json_data = { gift: gift[0]?.total || 0, call: call[0]?.total || 0, steram: steram[0]?.total || 0, chat: chat[0]?.total || 0, grand: grand || 0 };

 return giveresponse(res, 200, true, "Host history API get success.", json_data);
});
