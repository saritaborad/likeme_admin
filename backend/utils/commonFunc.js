const { ObjectId } = require("mongodb");
const path = require("path");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path,
 ffprobePath = require("@ffprobe-installer/ffprobe").path,
 ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

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

function deleteFile(fileName) {
 let filePath = path.join(__dirname + "/../" + fileName);
 if (filePath !== null) if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

function isValidObjectId(value) {
 const pattern = /^[0-9a-fA-F]{24}$/;
 return ObjectId.isValid(value) && pattern.test(value);
}

const generateThumb = async (videoPath, thumbName) => {
 await new Promise((resolve, reject) => {
  ffmpeg(videoPath)
   .seekInput(10)
   .screenshots({
    count: 1,
    folder: path.join(__dirname + "/../" + "uploads/thumbnail"),
    filename: thumbName,
    size: "340x340",
   })
   .on("end", () => {
    resolve();
   })
   .on("error", (err) => {
    reject(err);
   });
 });
};

function compressVideo(inputBuffer) {
 return new Promise((resolve, reject) => {
  ffmpeg()
   .input(inputBuffer)
   .inputFormat("mp4")
   .videoCodec("libx264")
   .audioCodec("aac")
   .toFormat("mp4")
   .on("end", () => {
    console.log("Video compression complete");
    resolve(ffmpeg().toBuffer());
   })
   .on("error", (err) => {
    console.error("Error compressing video:", err);
    reject(err);
   })
   .pipe();
 });
}
module.exports = { generateCode, deleteFile, isValidObjectId, generateThumb, compressVideo };
