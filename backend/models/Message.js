const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
 {
  title: {
   type: String,
  },
  type: {
   type: Number,
   default: 0,
   enum: [0, 1], // 0=string, 1=image_file
  },
 },
 {
  timestamps: true,
 }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
