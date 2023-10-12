const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
 {
  banner_id: { type: String },
  interstitial_id: { type: String },
  native_id: { type: String },
  rewarded_id: { type: String },
  type: { type: String },
 },
 {
  timestamps: true,
 }
);

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
