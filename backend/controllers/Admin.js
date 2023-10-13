const AdminUser = require("../models/AdminUser");
const { giveresponse, asyncHandler } = require("../utils/res_help");
const Agent = require("../models/Agent");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");

exports.login = asyncHandler(async (req, res) => {
 const { user_type, username, password, rememberme } = req.body;
 const cookieValue = `${user_type}|${username}|${password}|${rememberme}`;

 let user, agent;

 if (user_type === "admin") {
  user = await AdminUser.findOne({ username });
  agent = false;
 } else if (user_type === "agent") {
  user = await Agent.findOne({ email_id: username });
  agent = true;
 }

 if (!user || user.password !== password) {
  req.session.user_type = user_type;
  return giveresponse(res, 400, false, "Invalid credentials");
 }

 req.session.username = user.username;
 req.session.password = user.password;
 req.session.type = user.type;
 req.session.user_type = user_type;

 if (rememberme) res.cookie("rememberme", cookieValue, { maxAge: 30 * 24 * 60 * 60 * 1000 });
 const authtoken = jwt.sign({ id: user._id, is_agent: agent }, process.env.JWT_SECRET, { expiresIn: Date.now() + 5 * 24 * 60 * 60 * 1000 });
 return giveresponse(res, 200, true, "Login success.", { authtoken });
});

exports.logout = asyncHandler(async (req, res) => {
 req.session.destroy();
 return giveresponse(res, 200, true, "Logout success.");
});
