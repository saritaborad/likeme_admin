const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
 {
  user_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User",
   required: true,
  },
  diamond: {
   type: Number,
   required: true,
  },
  account_info: {
   type: String,
   required: true,
  },
  payment_getway_title: {
   type: String,
   required: true,
  },
  completed_at: {
   type: Date,
  },
  is_request_panding: {
   type: Number,
   default: 0,
  },
  redeem_token: {
   type: String,
   required: true,
  },
  amount_paid: {
   type: Number,
   default: 0,
  },
  request_status: {
   type: Number,
   default: 0, // 0- pending 1-completed 2-rejected
  },
  stream_days: {
   type: Number,
   default: 0,
  },
  stream_minits: {
   type: Number,
   default: 0,
  },
  stream_rate: {
   type: Number,
   default: 0,
  },
  coins: {
   type: Number,
   default: 0,
  },
  coins_rate: {
   type: Number,
   default: 0,
  },
  package_name: {
   type: String,
   default: "com.likeme.makematchcall",
  },
 },
 {
  timestamps: true,
 }
);

redeemSchema.virtual("user", { ref: "User", localField: "user_id", foreignField: "_id", justOne: true });
redeemSchema.set("toObject", { virtuals: true });
redeemSchema.set("toJSON", { virtuals: true });
const Redeem = mongoose.model("Redeem", redeemSchema);

module.exports = Redeem;
