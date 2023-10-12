const apiKeyMiddleware = (req, res, next) => {
 const apiKey = req.header("APIKey");

 if (apiKey === "123") {
  return next();
 } else {
  const data = {
   status: false,
   message: "Unauthorized Access",
  };
  return res.status(403).json(data);
 }
};

module.exports = apiKeyMiddleware;
