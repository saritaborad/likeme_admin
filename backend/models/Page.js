const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
 {
  type: {
   type: Number,
   required: true,
   enum: [0, 1], // 0=terms_of_use, 1=privacy_policy
  },
  privacy_policy: {
   type: String,
  },
  terms_of_use: {
   type: String,
  },
 },
 {
  timestamps: true,
 }
);

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;
