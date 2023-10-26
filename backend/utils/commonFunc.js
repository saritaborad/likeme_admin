const { ObjectId } = require("mongodb");
const { giveresponse } = require("./res_help");

function generateCode() {
 function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let randomString = "";
  for (let i = 0; i < length; i++) {
   randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomString;
 }

 const token = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
 const first = generateRandomString(3) + token + generateRandomString(3);

 return first;
}

function deleteFile(filename) {
 if (filename !== null) {
  const filePath = path.join(__dirname, "public", filename);
  if (fs.existsSync(filePath)) {
   fs.unlinkSync(filePath);
  }
 }
}

function isValidObjectId(value) {
 const pattern = /^[0-9a-fA-F]{24}$/;
 return ObjectId.isValid(value) && pattern.test(value);
}

module.exports = { generateCode, deleteFile, isValidObjectId };
