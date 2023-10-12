const mongoose = require("mongoose");

const userSpendTransactionHistorySchema = new mongoose.Schema(
 {
  type: { type: Number, enum: [1, 2, 3, 4, 5] }, // 1 - gift 2 - call 3 - stream 4 - chat 5 - match
  send_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  received_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diamond: { type: Number },
  host_paided: { type: Number, enum: [1, 2] }, // 1 -pending 2 - paided
  package_name: { type: String, default: "com.likeme.makematchcall" },
 },
 { timestamps: true }
);

// Define methods or virtuals if needed
userSpendTransactionHistorySchema.virtual("user", {
 ref: "User",
 localField: "send_by",
 foreignField: "_id",
 justOne: true,
});

userSpendTransactionHistorySchema.virtual("host", {
 ref: "User",
 localField: "received_by",
 foreignField: "_id",
 justOne: true,
});

userSpendTransactionHistorySchema.set("toObject", { virtuals: true });
userSpendTransactionHistorySchema.set("toJSON", { virtuals: true });

const UserSpendTransactionHistory = mongoose.model("UserSpendTransactionHistory", userSpendTransactionHistorySchema);
module.exports = UserSpendTransactionHistory;
