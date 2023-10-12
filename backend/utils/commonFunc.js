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

module.exports = { generateCode, deleteFile };
