const User = require("../models/User");
const { asyncHandler, giveresponse } = require("../utils/res_help");

const checkHeader = asyncHandler(async (req, res, next) => {
 let auth_token;
 if (req.headers["authtoken"]) auth_token = req.headers["authtoken"];

 if (!auth_token) return giveresponse(res, 403, false, "Unauthorized Access");

 if (auth_token) {
  const user = await User.findOne({ auth_token });

  if (!user) return giveresponse(res, 400, false, "Invalid Token");
  return next();
 }
});

module.exports = checkHeader;
