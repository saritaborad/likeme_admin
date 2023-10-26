const { ObjectId } = require("mongodb");
const { giveresponse } = require("../utils/res_help");

const reqired = (...fields) => {
 return (req, res, next) => {
  const missingFields = fields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) return giveresponse(res, 400, false, `${missingFields.join(", ")} required`);
  next();
 };
};

const isValidId = (...value) => {
 const pattern = /^[0-9a-fA-F]{24}$/;

 return (req, res, next) => {
  const Invalid = value.filter((field) => !(ObjectId.isValid(req.body[field]) && pattern.test(req.body[field])));
  if (Invalid.length > 0) return giveresponse(res, 400, false, `Invalid ${Invalid.join(", ")} !`);
  next();
 };
};

module.exports = { reqired, isValidId };
