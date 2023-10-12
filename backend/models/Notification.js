const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
 {
  title: {
   type: String,
   required: true,
  },
  description: {
   type: String,
   required: true,
  },
  user_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
  },
  user_type: {
   type: Number,
   default: 0,
  },
  identity: {
   type: String,
  },
  diamond_per_min: {
   type: Number,
  },
  agoraToken: {
   type: String,
  },
 },
 {
  timestamps: true,
 }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
