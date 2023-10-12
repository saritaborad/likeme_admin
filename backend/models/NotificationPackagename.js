const mongoose = require("mongoose");

const notificationPackageSchema = new mongoose.Schema(
 {
  package_name: {
   type: String,
   required: true,
  },
  fcm_key: {
   type: String,
   required: true,
  },
  device_type: {
   type: Number,
   required: true, // 1 android 2 ios
  },
  app_name: {
   type: String,
  },
 },
 {
  timestamps: true,
 }
);

const NotificationPackagename = mongoose.model("NotificationPackagename", notificationPackageSchema);
module.exports = NotificationPackagename;
