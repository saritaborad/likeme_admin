const { giveresponse, asyncHandler } = require("../utils/res_help");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const path = require("path");
const { default: mongoose } = require("mongoose");
const { isValidObjectId } = require("../utils/commonFunc");

const AdminUser = require("../models/AdminUser");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Agent = require("../models/Agent");
const Country = require("../models/Country");
const UserSpendTransactionHistory = require("../models/UserSpendTransactionHistory");
const UserGainTransactionHistory = require("../models/UserGainTransactionHistory");
const HostLiveStreamTrack = require("../models/HostLiveStreamTrack");
const Video = require("../models/Video");
const Image = require("../models/Image");
const Redeem = require("../models/Redeem");

exports.login = asyncHandler(async (req, res) => {
 const { user_type, username, password, rememberme } = req.body;
 const cookieValue = `${user_type}|${username}|${password}|${rememberme}`;

 let user, agent, tester;

 if (user_type === "admin") {
  user = await AdminUser.findOne({ username });
  agent = false;
 } else if (user_type === "agent") {
  user = await Agent.findOne({ email_id: username });
  agent = true;
 }

 if (!user || user.password !== password) {
  req.session.user_type = user_type;
  return giveresponse(res, 400, false, "Invalid credentials");
 }

 !agent && user?.type == 1 ? (tester = true) : (tester = false);
 req.session.username = user.username;
 req.session.password = user.password;
 req.session.type = user.type;
 req.session.user_type = user_type;

 if (rememberme) res.cookie("rememberme", cookieValue, { maxAge: 30 * 24 * 60 * 60 * 1000 });
 const authtoken = jwt.sign({ id: user._id, is_agent: agent, is_tester: tester }, process.env.JWT_SECRET, { expiresIn: Date.now() + 5 * 24 * 60 * 60 * 1000 });
 return giveresponse(res, 200, true, "Login success.", { authtoken });
});

exports.logout = asyncHandler(async (req, res) => {
 req.session.destroy();
 return giveresponse(res, 200, true, "Logout success.");
});

// --------------- database convertion from mysql to mongo script ---------------------------
exports.addNormalDB = asyncHandler(async (req, res) => {
 const { dbName, jsonFile } = req.body;
 const dynamicSchema = mongoose.model(dbName).schema;
 const dynamicModel = mongoose.model(dbName, dynamicSchema);

 fs.readFile(path.join(__dirname + "/../dbJson" + `/${jsonFile}`), "utf-8", (err, data) => {
  if (err) return giveresponse(res, 400, true, "Error reading agent data", err);
  const dynamicData = JSON.parse(data);
  for (item of dynamicData.data) {
   const dynamicDocument = {};

   for (const key in item) {
    if (item.hasOwnProperty(key) && key !== "id") {
     switch (key) {
      case "images":
       const originalPath = item.images;
       const newPath = "uploads/images/" + originalPath.substring(originalPath.lastIndexOf("/") + 1);
       const updatedPath = newPath.replace(/\//g, "\\");
       dynamicDocument[key] = updatedPath;
       break;
      case "video":
       const original = item.video;
       const newP = "uploads/videos/" + original.substring(original.lastIndexOf("/") + 1);
       const updated = newP.replace(/\//g, "\\");
       dynamicDocument[key] = updated;
       break;
      case "created_at" || "date":
       dynamicDocument["createdAt"] = new Date(item[key]);
       break;
      case "updated_at":
       dynamicDocument["updatedAt"] = new Date(item[key]);
       break;

      default:
       dynamicDocument[key] = item[key];
     }
    }
   }

   const document = new dynamicModel(dynamicDocument);
   document.save();
  }
 });

 return giveresponse(res, 200, true, "Data processing complete");
});

exports.addRelationalDB = asyncHandler(async (req, res) => {
 let user;
 let country;
 let agent;
 let notification;
 let video;
 let image;
 let userSpend;
 let userGain;
 let liveStream;
 let redeem;

 const agentData = await readFile(path.join(__dirname, "../dbJson/agent.json"), "utf-8");
 const countryData = await readFile(path.join(__dirname, "../dbJson/country.json"), "utf-8");
 const userData = await readFile(path.join(__dirname, "../dbJson/user1.json"), "utf-8");
 //  const notificationData = await readFile(path.join(__dirname, "../dbJson/notification.json"), "utf-8");
 //  const videoData = await readFile(path.join(__dirname, "../dbJson/video.json"), "utf-8");
 //  const imageData = await readFile(path.join(__dirname, "../dbJson/images.json"), "utf-8");
 //  const UserSpendData = await readFile(path.join(__dirname, "../dbJson/user_spend_transaction_history.json"), "utf-8");
 //  const userGainData = await readFile(path.join(__dirname, "../dbJson/user_gain_transaction_history.json"), "utf-8");
 //  const livestreamData = await readFile(path.join(__dirname, "../dbJson/host_live_stream_track.json"), "utf-8");
 //  const redeemData = await readFile(path.join(__dirname, "../dbJson/redeem.json"), "utf-8");

 agent = JSON.parse(agentData);
 country = JSON.parse(countryData);
 user = JSON.parse(userData);
 //  notification = JSON.parse(notificationData);
 //  video = JSON.parse(videoData);
 //  image = JSON.parse(imageData);
 //  userSpend = JSON.parse(UserSpendData);
 //  userGain = JSON.parse(userGainData);
 //  liveStream = JSON.parse(livestreamData);
 //  redeem = JSON.parse(redeemData);
 //  const country = await Country.find();
 //  const agent = await Agent.find();
 for (c1 of country.data) {
  const cont = new Country({ country_name: c1.country_name, position: c1.position, id: c1.id });
  await cont.save();

  for (a1 of agent.data) {
   if (c1.id == a1.contry) {
    a1.contry = cont._id || null;
   }
  }

  for (u of user.data) {
   if (c1.id == u.country_id) {
    u.country_id = cont._id || null;
   }
  }
 }

 for (a2 of agent.data) {
  const agentPath = a2.images;
  const newAGPath = agentPath && agentPath != "NULL" ? "uploads/images/" + agentPath?.substring(agentPath.lastIndexOf("/") + 1) : null;
  const updatedAGPath = newAGPath?.replace(/\//g, "\\");

  const agent1 = new Agent({ name: a2.name, images: updatedAGPath, email_id: a2.email_id, phone_no: a2.phone_no, contry: isValidObjectId(a2.contry) ? a2.contry : null, status: a2.status, password: a2.password, is_deleted: a2.is_deleted, createdAt: new Date(a2.crate_at), coins: a2.coins, coins_rate: a2.coins_rate, stream_minits: a2.stream_minits, stream_rate: a2.stream_rate, id: a2.id });
  await agent1.save();

  for (u2 of user.data) {
   if (u2?.agent_id && u2.agent_id == a2.id) {
    u2.agent_id = agent1._id;
   }
  }
 }

 for (u3 of user.data) {
  const userPath = u3.profileimages;
  const newUPath = userPath && userPath != "NULL" ? "uploads/images/" + userPath?.substring(userPath.lastIndexOf("/") + 1) : null;
  const updatedUPath = newUPath?.replace(/\//g, "\\");
  const newUser = new User({ fullName: u3.fullName, profileimages: updatedUPath, identity: u3.identity, language: u3.language, loginType: u3.loginType, deviceToken: u3.deviceToken, package_name: u3.package_name, age: u3.age, about: u3.about, bio: u3.bio, billingAddress: u3.billingAddress, availabiltyHours: u3.availabiltyHours, is_block: u3.is_block, is_host: u3.is_host, email: u3.email, diamond: u3.diamond, country_id: isValidObjectId(u3.country_id) ? u3.country_id : null, diamond_per_min: u3.diamond_per_min, total_diamond: u3.total_diamond, is_fake: u3.is_fake, is_video_call: u3.is_video_call, deviceType: u3.deviceType, one_signal_id: u3.one_signal_id, call_status: u3.call_status, auth_token: u3.auth_token, is_feature: u3.is_feature, version: u3.version, device_id: u3.device_id, gender: u3.gender, agent_id: isValidObjectId(u3.agent_id) ? u3.agent_id : null, createdAt: new Date(u3.created_at), updatedAt: new Date(u3.updated_at), id: u3.id });

  await newUser.save();

  // for (n1 of notification.data) {
  //  if (n1.user_id == u3.id) {
  //   n1.user_id = newUser._id;
  //  }
  // }

  // for (v1 of video.data) {
  //  if (v1.user_id == u3.id) {
  //   v1.user_id = newUser._id;
  //  }
  // }

  // for (i1 of image.data) {
  //  if (i1.user_id == u3.id) {
  //   i1.user_id = newUser._id;
  //  }
  // }

  // for (us1 of userSpend.data) {
  //  if (us1.send_by == u3.id) {
  //   us1.send_by = newUser._id;
  //  }
  //  if (us1.received_by == u3.id) {
  //   us1.received_by = newUser._id;
  //  }
  // }

  // for (ug1 of userGain.data) {
  //  if (ug1.user_id == u3.id) {
  //   ug1.user_id = newUser._id;
  //  }
  // }

  // for (l1 of liveStream.data) {
  //  if (l1.host_id == u3.id) {
  //   l1.host_id = newUser._id;
  //  }
  // }

  // for (r1 of redeem.data) {
  //  if (r1.user_id == u3.id) {
  //   r1.user_id = newUser._id;
  //  }
  // }
 }

 //  for (n2 of notification.data) {
 //   const noti = new Notification({ title: n2.title, description: n2.description, user_id: isValidObjectId(n2.user_id) ? n2.user_id : null, user_type: n2.user_type, identity: n2.identity, diamond_per_min: n2.diamond_per_min, agoraToken: n2.agoraToken, createdAt: new Date(n2.created_at), updatedAt: new Date(n2.updated_at) });
 //   await noti.save();
 //  }

 //  for (i2 of image.data) {
 //   const imgPath = i2.image;
 //   const newIPath = imgPath && imgPath != "NULL" ? "uploads/images/" + imgPath?.substring(imgPath.lastIndexOf("/") + 1) : null;
 //   const updatedIPath = newIPath?.replace(/\//g, "\\");
 //   const img = new Image({ image: updatedIPath, user_id: isValidObjectId(i2.user_id) ? i2.user_id : null });
 //   await img.save();
 //  }

 //  for (v2 of video.data) {
 //   const vidPath = v2.video;
 //   const newVPath = vidPath && vidPath != "NULL" ? "uploads/videos/" + vidPath?.substring(vidPath.lastIndexOf("/") + 1) : null;
 //   const updatedVPath = newVPath?.replace(/\//g, "\\");

 //   const thumbPath = v2.thumbnail_image;
 //   const newTPath = thumbPath && thumbPath != "NULL" ? "uploads/images/" + thumbPath?.substring(thumbPath.lastIndexOf("/") + 1) : null;
 //   const updatedTPath = newTPath?.replace(/\//g, "\\");

 //   const vid = new Video({ video: updatedVPath, user_id: isValidObjectId(v2.user_id) ? v2.user_id : null, video_link: v2.video_link, is_one_to_one: v2.is_one_to_one, thumbnail_image: updatedTPath });
 //   await vid.save();
 //  }

 //  for (us2 of userSpend.data) {
 //   const userSp = new UserSpendTransactionHistory({ type: us2.type, diamond: us2.diamond, send_by: isValidObjectId(us2.send_by) ? us2.send_by : null, received_by: isValidObjectId(us2.received_by) ? us2.received_by : null, host_paided: us2.host_paided, package_name: us2.package_name, createdAt: new Date(us2.create_at) });
 //   await userSp.save();
 //  }

 //  for (ug2 of userGain.data) {
 //   const userGa = new UserGainTransactionHistory({ type: ug2.type, diamond: ug2.diamond, user_id: isValidObjectId(ug2.user_id) ? ug2.user_id : null, sku: ug2.sku, GPA_TOKEN: ug2.GPA_TOKEN, purchase_token: ug2.purchase_token, version: ug2.version, package_name: ug2.package_name, createdAt: new Date(ug2.create_at) });
 //   await userGa.save();
 //  }

 //  for (l2 of liveStream.data) {
 //   const liveS = new HostLiveStreamTrack({ host_id: isValidObjectId(l2.host_id) ? l2.host_id : null, start: new Date(l2.start), end: new Date(l2.end) });
 //   await liveS.save();
 //  }

 //  for (r2 of redeem.data) {
 //   const redem = new Redeem({ user_id: isValidObjectId(r2.user_id) ? r2.user_id : null, created_at: new Date(r2.created_at), updated_at: new Date(r2.updated_at), completed_at: new Date(r2.completed_at), diamond: r2.diamond, account_info: r2.account_info, payment_getway_title: r2.payment_getway_title, is_request_panding: r2.is_request_panding, redeem_token: r2.redeem_token, amount_paid: r2.amount_paid, request_status: r2.request_status, stream_days: r2.stream_days, stream_minits: r2.stream_minits, stream_rate: r2.stream_rate, coins: r2.coins, coins_rate: r2.coins_rate, package_name: r2.package_name });
 //   await redem.save();
 //  }

 return giveresponse(res, 200, true, "Data processing complete");
});

exports.changeArrOfDb = asyncHandler(async (req, res) => {
 const user = await User.find();
 const country = await Country.find();

 const countryData = await readFile(path.join(__dirname, "../dbJson/country.json"), "utf-8");
 const userData = await readFile(path.join(__dirname, "../dbJson/user1.json"), "utf-8");

 countryJson = JSON.parse(countryData);
 userJson = JSON.parse(userData);

 for (user1 of userJson.data) {
  let inte_arr = [];
  let cont_arr = [];
  let block_arr = [];
  const intC = JSON.parse(user1.save_profile);
  const cont = JSON.parse(user1.interested_country);
  const block = JSON.parse(user1.is_block_list);

  if (intC && intC.length > 0) {
   for (i1 of intC) {
    for (u1 of user) {
     if (u1.id == i1) {
      inte_arr.push(u1._id);
     }
    }
   }
  }
  if (cont && cont.length > 0) {
   for (c2 of cont) {
    for (c1 of country) {
     if (c1.id == c2) {
      cont_arr.push(c1._id);
     }
    }
   }
  }

  if (block && block.length > 0) {
   for (b2 of block) {
    for (b1 of user) {
     if (b1.id == b2) {
      block_arr.push(b1._id);
     }
    }
   }
  }

  await User.findOneAndUpdate({ id: user1.id }, { $set: { save_profile: inte_arr, interested_country: cont_arr, is_block_list: block_arr } }, { new: true });
 }

 return giveresponse(res, 200, true, "Data processing complete");
});

exports.addUserIdToDB = asyncHandler(async (req, res) => {
 const { jsonFile, dbName } = req.body;
 const dynamicSchema = mongoose.model(dbName).schema;
 const dynamicModel = mongoose.model(dbName, dynamicSchema);
 const data = await readFile(path.join(__dirname, "../dbJson" + `/${jsonFile}`), "utf-8");

 let jsonData = JSON.parse(data);

 const users = await User.find();

 for (item of jsonData.data) {
  const dynamicDocument = {};

  for (const key in item) {
   if (item.hasOwnProperty(key) && key !== "id") {
    switch (key) {
     case "user_id":
      const user = users.find((u1) => u1.id == item.user_id);
      dynamicDocument["user_id"] = user ? user._id : null;
      break;
     case "host_id":
      const host = users.find((u1) => u1.id == item.host_id);
      dynamicDocument["host_id"] = host ? host._id : null;
      break;
     case "send_by":
      const userSpend = users.find((u1) => u1.id == item.send_by);
      dynamicDocument["send_by"] = userSpend ? userSpend._id : null;
      break;
     case "received_by":
      const userSpend1 = users.find((u1) => u1.id == item.received_by);
      dynamicDocument["received_by"] = userSpend1 ? userSpend1._id : null;
      break;
     case "image":
      const originalPath = item.image;
      const newPath = "uploads/images/" + originalPath.substring(originalPath.lastIndexOf("/") + 1);
      const updatedPath = newPath.replace(/\//g, "\\");
      dynamicDocument[key] = updatedPath;
      break;
     case "video":
      const original = item.video;
      const newP = "uploads/videos/" + original.substring(original.lastIndexOf("/") + 1);
      const updated = newP.replace(/\//g, "\\");
      dynamicDocument[key] = updated;
      break;
     case "thumbnail_image":
      const thumbPath = item.thumbnail_image;
      const newTPath = thumbPath && thumbPath != "NULL" ? "uploads/thumbnail/" + thumbPath?.substring(thumbPath.lastIndexOf("/") + 1) : null;
      const updatedTPath = newTPath?.replace(/\//g, "\\");
      dynamicDocument[key] = updatedTPath;
      break;
     case "created_at" || "create_at":
      dynamicDocument["createdAt"] = new Date(item[key]);
      break;
     case "date":
      dynamicDocument["date"] = new Date(item[key]);
      break;
     case "start":
      dynamicDocument["start"] = new Date(item[key]);
      break;
     case "end":
      dynamicDocument["end"] = new Date(item[key]);
      break;
     case "completed_at":
      dynamicDocument["completed_at"] = new Date(item[key]);
      break;
     case "updated_at":
      dynamicDocument["updatedAt"] = new Date(item[key]);
      break;

     default:
      dynamicDocument[key] = item[key];
    }
   }
  }

  const document = new dynamicModel(dynamicDocument);
  await document.save();
 }
 return giveresponse(res, 200, true, "Data processing complete");
});
