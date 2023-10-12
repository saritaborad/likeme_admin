const mongoose = require("mongoose");

const ImageReviewSchema = new mongoose.Schema(
 {
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String },
 },
 { timestamps: true }
);

module.exports = mongoose.model("ImageReview", ImageReviewSchema);
