exports.checkLoginAgent = async (req, res, next) => {
 if (req.session.username && req.session.user_type === "agent") {
  return next();
 } else {
  return res.redirect("/");
 }
};
