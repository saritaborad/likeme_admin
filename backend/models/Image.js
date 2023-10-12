const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
 {
  user_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
  },
  image: { type: String },
 },
 {
  timestamps: true,
 }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
