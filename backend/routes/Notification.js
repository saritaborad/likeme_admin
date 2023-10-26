const express = require("express");
const { addNotificationContent, fetchNotificationContent, updateNotificationContent, deleteNotificationContent, sendNotification, notificationRemove, sendNotificationToUsers, adminSendNotification, fetchNotification, fetchAllNotification, updateNotification, deleteNotificationyById, addNotificationTable, getNotificationTable, fetchNotificationTable, updateNotificationTable, deleteNotificationTable, getNotificationCredential, deleteNotificationCredential, updateNotificationCredential, addNotificationCredential, fetchNotificationAdmin, updateNotificationAdmin, addNotificationAdmin, deleteNotificationAdmin } = require("../controllers/Notification");
const checkHeader = require("../middleware/checkHeader");
const { reqired, isValidId } = require("../middleware/validateField");

const router = express.Router();

router.post("/sendNotification", sendNotification);
router.post("/notificationRemove", checkHeader, reqired("user_id"), isValidId("user_id"), notificationRemove);
router.post("/sendNotificationToUsers", sendNotificationToUsers);
router.post("/adminSendNotification", adminSendNotification);

router.post("/fetchNotification", fetchNotification);
router.post("/fetchAllNotification", fetchAllNotification);
router.post("/updateNotification", updateNotification);
router.post("/deleteNotificationyById", deleteNotificationyById);

// ----------------- Notification Content Routes------

router.post("/addNotificationAdmin", addNotificationAdmin);
router.post("/fetchNotificationAdmin", fetchNotificationAdmin);
router.post("/updateNotificationAdmin", updateNotificationAdmin);
router.post("/deleteNotificationAdmin", deleteNotificationAdmin);

// ----------------- Notification Table Routes---------

router.post("/getNotificationTable", getNotificationTable);
router.post("/addNotificationCredential", addNotificationCredential);
router.post("/getNotificationCredential", getNotificationCredential);
router.post("/updateNotificationCredential", updateNotificationCredential);
router.post("/deleteNotificationCredential", deleteNotificationCredential);

module.exports = router;
