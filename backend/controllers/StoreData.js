const { asyncHandler, giveresponse } = require("../utils/res_help");

exports.storeFileGivePath = asyncHandler(async (req, res, next) => {
 if (!req.file) {
  return res.json({ status: false, message: "No file uploaded." });
 }

 const file = new File({
  name: req.file.originalname,
  path: req.file.path,
 });

 file.save((err) => {
  if (err) {
   return res.json({ status: false, message: "Error saving the file." });
  }

  return giveresponse(res, 200, true, "File uploaded successfully.", req.file.path);
 });
});
