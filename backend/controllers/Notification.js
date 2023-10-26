const { giveresponse, asyncHandler } = require("../utils/res_help");
const Notification = require("../models/Notification");
const User = require("../models/User");
const ApiFeatures = require("../utils/ApiFeatures");
const NotiPackageName = require("../models/NotificationPackagename");
const NotificationAdmin = require("../models/NotificationAdmin");
const NotificationPackagename = require("../models/NotificationPackagename");

exports.sendNotification = asyncHandler(async (req, res, next) => {
 const data = await NotificationPackagename.find();

 const url = "https://fcm.googleapis.com/fcm/send";
 const { title, description } = req.body;
 let result;

 for (const item of data) {
  const notificationArray = { title: title, body: description, sound: "default", badge: "1" };

  const fields = {
   to: "/topics/dimdim_android",
   notification: notificationArray,
   priority: "high",
  };
  const headers = { "Content-Type": "application/json", Authorization: "key=" + item.fcm_key };

  const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(fields) });

  result = await response.json();
 }
 const addNoti = new Notification({ title, description });
 await addNoti.save();

 if (result) {
  return giveresponse(res, 200, true, "Notification created successfully!");
 } else {
  return giveresponse(res, 400, false, "Something went wrong!");
 }
});

exports.sendNotificationToUsers = asyncHandler(async (req, res, next) => {
 // Validator
 const { user_id, username, identity, diamond_per_min, agoraToken } = req.body;
 if (!user_id || !username || !identity || !diamond_per_min || !agoraToken) return res.json({ status: false, message: "Validation failed" });

 const FCMKEYs = await NotificationPackagename.find();
 const url = "https://fcm.googleapis.com/fcm/send";

 // Add data to notification
 const randomNotification = await Notification.aggregate([{ $sample: { size: 1 } }]);
 const notificationData = randomNotification[0];
 const titleUser = notificationData.title.replace("Name", username);
 const descriptionUser = notificationData.description.replace("Name", username);

 for (const data of FCMKEYs) {
  const api_key = data.fcm_key;
  const notificationArray = { title: titleUser, body: descriptionUser, sound: "default", badge: "1", user_id: user_id, identity: identity, notification_type: "LIVE" };
  const fields = { to: "/topics/dimdim_android", data: notificationArray, priority: "high" };
  const headers = { "Content-Type": "application/json", Authorization: "key=" + api_key };
  const response = await fetch(url, { method: "POST", headers: headers, body: JSON.stringify(fields) });
  result = await response.json();
 }

 const notification = new Notification({ title: titleUser, description: descriptionUser, user_id: user_id, identity: identity, user_type: 1, diamond_per_min: diamond_per_min, agoraToken: agoraToken });

 const savedNotification = await notification.save();

 return giveresponse(res, 200, true, "Notification Successfully Set", savedNotification);
});

exports.adminSendNotification = asyncHandler(async (req, res, next) => {
 const defaultTitleString = "is available";
 const defaultDescriptionString = "is available to take calls and chat, message her and have fun 😍";

 const notification = new Notification({
  title: req.body.title + defaultTitleString,
  description: req.body.description + defaultDescriptionString,
 });

 const result = await notification.save();

 if (result) return giveresponse(res, 200, true, "This user Notification added", result);
});

exports.fetchNotification = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Notification.find(), req.body).sort().pagination();
 const results = apiFeature.query;

 const resultsWithImages = await Promise.all(
  results.map(async (data) => {
   const resultImage = await Images.findOne({ user_id: data.user_id }).select("image").exec();
   data.image = resultImage ? resultImage.image : null;
   return data;
  })
 );

 return giveresponse(res, 200, true, "Fetch Notification successfully!", resultsWithImages);
});

// -------------------- admin API -------------

exports.fetchAllNotification = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(Notification.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await Notification.countDocuments();
 return giveresponse(res, 200, true, "all notification get success.", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.deleteNotificationyById = asyncHandler(async (req, res, next) => {
 const result = await Notification.deleteOne({ _id: req.body._id });
 if (result.acknowledged) return giveresponse(res, 200, true, "Notification data deleted");
});

exports.updateNotification = asyncHandler(async (req, res, next) => {
 const result = await Notification.updateOne({ _id: req.body._id }, { $set: { title: req.body.title, description: req.body.description } });
 if (result) return giveresponse(res, 200, true, "Updated successfully!");
});

//---------------------- Notification Table // notification_packagename ---------------------------

exports.addNotificationCredential = asyncHandler(async (req, res, next) => {
 const addNoti = new NotiPackageName({ package_name: req.body.package_name, fcm_key: req.body.fcm_key, device_type: req.body.device_type });
 await addNoti.save();
 return giveresponse(res, 200, true, "Added successfully!");
});

exports.getNotificationCredential = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(NotiPackageName.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await NotiPackageName.countDocuments();
 return giveresponse(res, 200, true, "Notification credential get success!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.updateNotificationCredential = asyncHandler(async (req, res, next) => {
 const result = await NotiPackageName.updateOne({ _id: req.body._id }, { $set: { package_name: req.body.package_name, fcm_key: req.body.fcm_key, device_type: req.body.device_type } });
 return giveresponse(res, 200, true, "Notification data is updated");
});

exports.deleteNotificationCredential = asyncHandler(async (req, res, next) => {
 const result = await NotiPackageName.deleteOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "Data deleted successfully!");
});

// ------------------------- Notification Content (DB:- noti admin) Routes------------------------

exports.addNotificationAdmin = asyncHandler(async (req, res, next) => {
 const addNoti = new NotificationAdmin({ title: req.body.title, description: req.body.description });
 const result = await addNoti.save();
 if (result) return giveresponse(res, 200, true, "Content added successfully!");
});

exports.fetchNotificationAdmin = asyncHandler(async (req, res, next) => {
 const apiFeature = new ApiFeatures(NotificationAdmin.find(), req.body?.options).search().sort().pagination();
 const data = await apiFeature.query;
 apiFeature.totalRecord = await NotificationAdmin.countDocuments();
 return giveresponse(res, 200, true, "Content added successfully!", { totalRecord: apiFeature.totalRecord, totalPage: apiFeature.totalPage, data: data });
});

exports.updateNotificationAdmin = asyncHandler(async (req, res, next) => {
 const result = await NotificationAdmin.updateOne({ _id: req.body._id }, { $set: { title: req.body.title, description: req.body.description } });
 if (result) return giveresponse(res, 200, true, "Notification data is updated");
});

exports.deleteNotificationAdmin = asyncHandler(async (req, res, next) => {
 const result = await NotificationAdmin.deleteOne({ _id: req.body._id });
 return giveresponse(res, 200, true, "Data deleted successfully!");
});

// ---------------------- android api -------------------------

exports.notificationRemove = asyncHandler(async (req, res, next) => {
 const user = User.findOne({ _id: req.body.user_id });
 if (!user) return giveresponse(res, 404, false, "User doesn't exist!");

 await Notification.deleteMany({ user_id: req.body.user_id });
 return giveresponse(res, 200, true, "Notification removed successfully!");
});

exports.getNotificationTable = asyncHandler(async (req, res, next) => {
 const data = await NotificationPackagename.find();
 return giveresponse(res, 200, true, "packagename get successfully", data);
});
