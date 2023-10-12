const User = require("./models/User");

const checkHeader = async (req, res, next) => {
 const auth_token = req.headers["auth-token"];

 if (auth_token) {
  try {
   const user = await User.findOne({ auth_token });

   if (user) {
    return next();
   } else {
    return res.status(403).json({ status: false, message: "Unauthorized Access" });
   }
  } catch (error) {
   return res.status(500).json({ error: "Internal Server Error" });
  }
 } else {
  return res.status(403).json({ status: false, message: "Unauthorized Access" });
 }
};

module.exports = checkHeader;
