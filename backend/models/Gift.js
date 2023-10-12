const mongoose = require("mongoose");

const giftSchema = new mongoose.Schema(
 {
  images: {
   type: String,
  },
  diamond: {
   type: Number,
  },
 },
 {
  timestamps: true,
 }
);

const Gift = mongoose.model("Gift", giftSchema);

module.exports = Gift;
