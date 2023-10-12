const { giveresponse, asyncHandler } = require("../utils/res_help");
const ApiFeatures = require("../utils/ApiFeatures");
const Agent = require("../models/Agent");
const fs = require("fs");
const path = require("path");

exports.fetchAllagent = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Agent.find().populate({ path: "country", select: "country_name _id" }), req.body?.options).search().sort().pagination();
 const agents = await apiFeature.query;
 apiFeature.totalRecord = await Agent.countDocuments();
 return giveresponse(res, 200, true, "Agent list get success", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, agents });
});

exports.addAgent = asyncHandler(async (req, res) => {
 const { name, email_id, password, phone_no, country, status, coins, coins_rate, stream_minute, stream_rate, images } = req.body;
 const agent = new Agent({ name, email_id, password, phone_no, country, status, images: images, coins, coins_rate, stream_minits: stream_minute, stream_rate });
 await agent.save();
 return giveresponse(res, 200, true, "Agent added successfully");
});

exports.editAgent = asyncHandler(async (req, res) => {
 const { name, email_id, password, phone_no, country, status, _id, images } = req.body;
 const agentsData = await Agent.findOne({ _id });

 if (!images) {
  await agentsData.updateOne({ name, email_id, password, phone_no, country, status });
 } else {
  if (fs.existsSync(path.join(__dirname, "..", agentsData.images)) && agentsData.images !== null) {
   fs.unlinkSync(path.join(__dirname, "..", agentsData.images));
  }

  await agentsData.updateOne({ name, email_id, password, phone_no, country, status, images: images });
 }

 return giveresponse(res, 200, true, "Agent updated successfully");
});

exports.deleteAgent = asyncHandler(async (req, res) => {
 const { _id } = req.body;
 const agent = await Agent.findOne({ _id });
 if (!agent) return giveresponse(res, 404, false, "Agent not found");

 const imagePath = path.join(__dirname, "..", agent.images);

 if (fs.existsSync(imagePath) && agent.images !== null) fs.unlinkSync(imagePath);

 const result = await Agent.deleteOne({ _id });

 if (result) return giveresponse(res, 200, true, "Successfully deleted");
});

exports.fetchAgents = asyncHandler(async (req, res, next) => {
 const agents = await Agent.find({ is_deleted: 0 }).sort({ _id: -1 }).select("name _id");
 return giveresponse(res, 200, true, "Agent data get success.", agents);
});
