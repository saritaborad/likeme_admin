const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema(
 {
  username: {
   type: String,
   required: true,
  },
  password: {
   type: String,
   required: true,
  },
  type: {
   type: Number,
   required: true,
   default: 0,
   enum: [0, 1], // 0 (admin), 1 (tester)
  },
 },
 {
  timestamps: true,
 }
);

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

module.exports = AdminUser;
