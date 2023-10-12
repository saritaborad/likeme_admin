const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
 user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
 reason: { type: String },
 description: { type: String },
 contact: { type: String },
});

reportSchema.virtual("user", { ref: "User", localField: "user_id", foreignField: "_id", justOne: true });
reportSchema.set("toObject", { virtuals: true });
reportSchema.set("toJSON", { virtuals: true });

const Redeem = mongoose.model("Report", reportSchema);
module.exports = Redeem;
