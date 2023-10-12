const mongoose = require("mongoose");

const userGainTransactionHistorySchema = new mongoose.Schema(
 {
  type: {
   type: Number,
   default: 1, //1 - purchase 2 - rewarded
   enum: [1, 2],
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  diamond: { type: Number },
  sku: { type: String },
  GPA_TOKEN: { type: String },
  purchase_token: { type: String },
  version: { type: String },
  package_name: { type: String, required: true },
 },
 { timestamps: true }
);

userGainTransactionHistorySchema.virtual("user", { ref: "User", localField: "user_id", foreignField: "_id", justOne: true });
userGainTransactionHistorySchema.set("toObject", { virtuals: true });
userGainTransactionHistorySchema.set("toJSON", { virtuals: true });

const UserGainTransactionHistory = mongoose.model("UserGainTransactionHistory", userGainTransactionHistorySchema);
module.exports = UserGainTransactionHistory;
