const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
 {
  price: { type: Number, required: true },
  diamond: { type: Number, required: true },
  app_store_id: { type: String, required: true },
  play_store_id: { type: String, required: true },
  default_flag: { type: Number, default: 0, enum: [0, 1] },
  discount_price: { type: Number, default: 0 },
  discount: { type: Number },
  orignal_sku: { type: String },
  position: { type: Number },
  highlight_text: { type: String },
  package_name: { type: String },
  bronze: { type: String },
  gold: { type: String },
  silver: { type: String },
 },
 { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
