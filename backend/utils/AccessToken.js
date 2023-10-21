class Message {
 constructor() {
  this.salt = Math.floor(Math.random() * 100000);
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1); // Add 24 hours
  this.ts = Math.floor(date.getTime() / 1000);
  this.privileges = {};
 }

 packContent() {
  let buffer = new Uint8Array(0);
  buffer = new Uint8Array([...buffer, ...Message.uint32ToBytes(this.salt)]);
  buffer = new Uint8Array([...buffer, ...Message.uint32ToBytes(this.ts)]);
  const numPrivileges = Object.keys(this.privileges).length;
  buffer = new Uint8Array([...buffer, ...Message.uint16ToBytes(numPrivileges)]);
  for (const key of Object.keys(this.privileges)) {
   buffer = new Uint8Array([...buffer, ...Message.uint16ToBytes(key)]);
   buffer = new Uint8Array([...buffer, ...Message.uint32ToBytes(this.privileges[key])]);
  }
  return buffer;
 }

 unpackContent(msg) {
  let pos = 0;
  this.salt = Message.bytesToUint32(msg.subarray(pos, pos + 4));
  pos += 4;
  this.ts = Message.bytesToUint32(msg.subarray(pos, pos + 4));
  pos += 4;
  const size = Message.bytesToUint16(msg.subarray(pos, pos + 2));
  pos += 2;
  this.privileges = {};
  for (let i = 0; i < size; i++) {
   const key = Message.bytesToUint16(msg.subarray(pos, pos + 2))[0];
   pos += 2;
   const value = Message.bytesToUint32(msg.subarray(pos, pos + 4))[0];
   pos += 4;
   this.privileges[key] = value;
  }
 }

 static uint16ToBytes(value) {
  return new Uint8Array([value, value >> 8]);
 }

 static uint32ToBytes(value) {
  return new Uint8Array([value, value >> 8, value >> 16, value >> 24]);
 }

 static bytesToUint16(bytes) {
  return new Uint16Array(bytes.buffer)[0];
 }

 static bytesToUint32(bytes) {
  return new Uint32Array(bytes.buffer)[0];
 }
}

class AccessToken {
 constructor() {
  this.appID = "";
  this.appCertificate = "";
  this.channelName = "";
  this.uid = "";
  this.message = new Message();
 }

 setUid(uid) {
  if (uid === 0) {
   this.uid = "";
  } else {
   this.uid = uid.toString();
  }
 }

 isNonEmptyString(name, str) {
  if (typeof str === "string" && str !== "") {
   return true;
  }
  console.log(`${name} check failed, should be a non-empty string`);
  return false;
 }

 static init(appID, appCertificate, channelName, uid) {
  const accessToken = new AccessToken();
  if (!accessToken.isNonEmptyString("appID", appID) || !accessToken.isNonEmptyString("appCertificate", appCertificate) || !accessToken.isNonEmptyString("channelName", channelName)) {
   return null;
  }
  accessToken.appID = appID;
  accessToken.appCertificate = appCertificate;
  accessToken.channelName = channelName;
  accessToken.setUid(uid);
  accessToken.message = new Message();
  return accessToken;
 }

 static initWithToken(token, appCertificate, channel, uid) {
  const accessToken = new AccessToken();
  if (!accessToken.extract(token, appCertificate, channel, uid)) {
   return null;
  }
  return accessToken;
 }

 addPrivilege(key, expireTimestamp) {
  this.message.privileges[key] = expireTimestamp;
  return this;
 }

 extract(token, appCertificate, channelName, uid) {
  const ver_len = 3;
  const appid_len = 32;
  const version = token.substr(0, ver_len);
  if (version !== "006") {
   console.log("Invalid version " + version);
   return false;
  }
  if (!this.isNonEmptyString("token", token) || !this.isNonEmptyString("appCertificate", appCertificate) || !this.isNonEmptyString("channelName", channelName)) {
   return false;
  }
  const appid = token.substr(ver_len, appid_len);
  const content = Buffer.from(token.slice(ver_len + appid_len), "base64");
  let pos = 0;
  const len = Message.bytesToUint16(content.slice(pos, pos + 2));
  pos += 2;
  const sig = content.slice(pos, pos + len);
  pos += len;
  const crc_channel = Message.bytesToUint32(content.slice(pos, pos + 4));
  pos += 4;
  const crc_uid = Message.bytesToUint32(content.slice(pos, pos + 4));
  pos += 4;
  const msgLen = Message.bytesToUint16(content.slice(pos, pos + 2));
  pos += 2;
  const msg = content.slice(pos, pos + msgLen);

  this.appID = appid;
  const message = new Message();
  message.unpackContent(msg);
  this.message = message;

  this.appCertificate = appCertificate;
  this.channelName = channelName;
  this.setUid(uid);

  return true;
 }

 build() {
  const msg = this.message.packContent();
  let val = [];
  val = val.concat(Array.from(Buffer.from(this.appID)));
  val = val.concat(Array.from(Buffer.from(this.channelName)));
  val = val.concat(Array.from(Buffer.from(this.uid)));
  val = val.concat(Array.from(msg));

  const sig = crypto.createHmac("sha256", this.appCertificate).update(Buffer.from(val)).digest();
  const crc_channel_name = crc32.unsigned(this.channelName) & 0xffffffff;
  const crc_uid = crc32.unsigned(this.uid) & 0xffffffff;

  const content = [];
  content.push(this.uint8ToUint32Array(sig));
  content.push(this.uint8ToUint32Array(crc_channel_name));
  content.push(this.uint8ToUint32Array(crc_uid));
  content.push(this.uint8ToUint16Array([msg.length]));
  content.push(Array.from(msg));

  const version = "006";
  const ret = version + this.appID + Buffer.from(content.flat()).toString("base64");
  return ret;
 }

 uint8ToUint32Array(arr) {
  return new Uint32Array(arr.buffer);
 }

 uint8ToUint16Array(arr) {
  return new Uint16Array(arr.buffer);
 }
}

function packString(value) {
 return Buffer.concat([Buffer.from(Message.uint16ToBytes(value.length)), Buffer.from(value)]);
}

// Example usage:
const appID = "YOUR_APP_ID";
const appCertificate = "YOUR_APP_CERTIFICATE";
const channelName = "YOUR_CHANNEL_NAME";
const uid = 123456; // User ID
const role = RtcRole.PUBLISHER; // You can use RtcRole.ADMIN or RtcRole.ATTENDEE if needed
const privilegeExpireTs = Math.floor(Date.now() / 1000) + 3600; // Set expiration time

const token = AccessToken.init(appID, appCertificate, channelName, uid);
token.addPrivilege(AccessToken.Privileges.kJoinChannel, privilegeExpireTs);
console.log(token.build());
