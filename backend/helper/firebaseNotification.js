const adminApp = require("../firebase-config/firebase_config");
const { giveresponse } = require("../utils/res_help");

exports.notificationToAllUsers = (res, title, body, tokens) => {
 // var notibody = {
 //     notification: {
 //         title: title,
 //         body: body
 //     },
 //     webpush: {
 //         fcmOptions: {
 //             link: "https//:www.google.com/"
 //         }
 //     },
 //     tokens
 // };

 const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
 };

 const message = {
  notification: {
   title,
   body,
  },
 };

 return new Promise((resolve, reject) => {
  adminApp
   .messaging()
   .sendMulticast({
    tokens, // ['token_1', 'token_2', ...]
    // data: message.notification,
    notification_options,
    notification: message.notification,
   })
   .then((response) => {
    if (response.responses[0].error !== undefined) {
     // console.log(response.responses[0].error);
     return giveresponse(res, 400, false, response.responses[0].error);
    } else {
     resolve(response);
    }
   })
   .catch((error) => {
    console.log(error);
    return giveresponse(res, 400, false, error.message);
   });
 });
};

exports.notificationToUser = (title, body, token) => {
 const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
 };

 const message = {
  notification: {
   title,
   body,
  },
 };

 return new Promise((resolve, reject) => {
  adminApp
   .messaging()
   .sendToDevice(token, message, notification_options)
   .then((res) => {
    resolve(res);
    // console.log("camera create");
   })
   .catch((err) => {
    console.log(err);
    reject(err);
   });
 });
};
