const mongoose = require("mongoose");

const admobSchema = new mongoose.Schema(
 {
  type: { type: Number, required: true },
  rewarded_id: { type: String },
  banner_id: { type: String },
  native_id: { type: String },
  intersial_id: { type: String },
 },
 {
  timestamps: true,
 }
);

const Admob = mongoose.model("Admob", admobSchema);
module.exports = Admob;
