const Messages = require("../models/Message");
const ApiFeatures = require("../utils/ApiFeatures");
const { asyncHandler, giveresponse } = require("../utils/res_help");
const path = require("path");
const fs = require("fs");

exports.fetchAllMessages = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Messages.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await Messages.countDocuments();

 return giveresponse(res, 200, true, "All messages successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.addMessage = asyncHandler(async (req, res, next) => {
 const addMessage = new Messages();

 if (req.file) {
  addMessage.title = req.file.path;
  addMessage.type = 1;
 } else {
  addMessage.title = req.body.title;
 }

 await addMessage.save();
 return giveresponse(res, 200, true, "Message added successfully!");
});

exports.fakeMessagesList = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Messages.find(), req.body).search().sort().pagination();
 const Messagecheat = apiFeature.query;
 apiFeature.totalRecord = await Messages.countDocuments();

 const data = Messagecheat.map((message) => {
  let title = message.type === 1 ? `<img alt="image" src="public/storage/${message.title}" width="50" height="50">` : message.title;
  let deleteButton = `<a href="" rel="${message._id}" class="btn btn-danger deleteMessage text-white">Delete</a>`;
  return [title, deleteButton];
 });

 return giveresponse(res, 200, true, "Data deleted successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.deleteMessageById = asyncHandler(async (req, res, next) => {
 const temp = await Messages.findById({ _id: req.body._id });
 if (!temp) return giveresponse(res, 404, false, "Message not found");
 if (temp.title && fs.existsSync(path.join(__dirname, "..", temp.title))) fs.unlinkSync(path.join(__dirname, "..", temp.title));
 await temp.deleteOne();
 return giveresponse(res, 200, true, "Message deleted successfully!");
});

exports.updateMessage = asyncHandler(async (req, res, next) => {
 const { _id, title } = req.body;
 const message = await Messages.findOne({ _id: _id });

 if (!message) return giveresponse(res, 404, false, "Message not found");

 if (req.file) {
  if (message.title && fs.existsSync(path.join("uploads/", message.title))) {
   fs.unlinkSync(path.join("uploads/", message.title));
  }

  message.title = req.file.filename;
 } else {
  message.title = title;
 }

 await message.save();

 return giveresponse(res, 200, true, "Message data is updated");
});
