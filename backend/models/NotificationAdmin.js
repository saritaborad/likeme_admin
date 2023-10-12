const mongoose = require("mongoose");

const notificationAdminSchema = new mongoose.Schema(
 {
  description: {
   type: String,
   required: true,
  },
  title: {
   type: String,
   required: true,
  },
 },
 {
  timestamps: true,
 }
);

const NotificationAdmin = mongoose.model("NotificationAdmin", notificationAdminSchema);

module.exports = NotificationAdmin;
