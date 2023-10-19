const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const agentSchema = new mongoose.Schema(
 {
  name: { type: String },
  images: { type: String },
  email_id: { type: String },
  phone_no: { type: String },
  contry: { type: mongoose.Schema.Types.ObjectId, ref: "Country" },
  status: { type: Number, default: 0 }, // 0 - disable 1 - enable
  password: { type: String },
  is_deleted: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  coins_rate: { type: Number, default: 0 },
  stream_minits: { type: Number, default: 0 },
  stream_rate: { type: Number, default: 0 },
 },
 {
  timestamps: true,
 }
);

// agentSchema.pre("save", async function (next) {
//  if (!this.isModified("password")) {
//   next();
//  }
//  this.password = await bcrypt.hash(this.password, 10);
// });

// agentSchema.methods.comparePassword = async function (enterpassword) {
//  return await bcrypt.compare(enterpassword, this.password);
// };

const Agent = mongoose.model("Agent", agentSchema);
module.exports = Agent;
