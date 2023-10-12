const sendToken = (user, statusCode, res, message) => {
 const token = user.getJWTToken();
 const options = { expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), httpOnly: true };
 res.status(statusCode).cookie("authtoken", token, options).json({ success: true, user, authtoken: token, message });
};

module.exports = sendToken;
