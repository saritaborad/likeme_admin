const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
 {
  agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  fullName: { type: String, default: null },
  identity: { type: String, default: null },
  language: { type: String, default: "en" },
  loginType: { type: Number, default: null },
  deviceToken: { type: String, default: null },
  package_name: { type: String, default: null },
  profileimages: { type: String, default: null },
  age: { type: Number, default: null },
  about: { type: String, default: null },
  bio: { type: String, default: null },
  billingAddress: { type: String, default: null },
  availabiltyHours: { type: Number, default: null },
  is_block: { type: Number, default: 0 }, //0-no  1-blocked
  is_host: { type: Number, default: 0, required: true }, // 0 -no   1-pending   2-approved
  email: { type: String, default: null },
  diamond: { type: Number, default: null },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: "Country", default: null },
  save_profile: { type: String, default: null },
  intrests: { type: Array, default: [] },
  diamond_per_min: { type: Number, default: 0 },
  total_diamond: { type: Number, default: 0, required: true },
  is_fake: { type: Number, default: 0, required: true }, // 0 -real   1-fake
  is_video_call: { type: Number, default: 1, required: true }, // 0-off  1-on
  deviceType: { type: Number, default: null }, // 1 - android    2 -ios
  one_signal_id: { type: String, default: null }, // for ios availble
  call_status: { type: Number, default: 0 }, // 0 - call not connected  1 - call connected
  is_block_list: { type: Array, default: [] },
  auth_token: { type: String, default: null },
  is_feature: { type: Number, default: 0 }, // 0 -select 1 -selected
  version: { type: Number, default: null },
  interested_country: { type: String, default: null },
  device_id: { type: String, default: null },
  gender: { type: String, default: null },
 },
 {
  timestamps: true,
 }
);

UserSchema.pre("save", async function (next) {
 if (!this.isModified("password")) {
  next();
 }
 this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.virtual("country_data", { ref: "Country", localField: "country_id", foreignField: "_id", justOne: false });

UserSchema.virtual("images", { ref: "Image", localField: "_id", foreignField: "user_id", justOne: true });

UserSchema.virtual("video", { ref: "Video", localField: "_id", foreignField: "user_id", justOne: false });

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

UserSchema.methods.getJWTToken = function () {
 return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: Date.now() + 5 * 24 * 60 * 60 * 1000 });
};

UserSchema.methods.comparePassword = async function (enterpassword) {
 return await bcrypt.compare(enterpassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
