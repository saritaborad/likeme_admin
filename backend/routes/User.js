const express = require("express");
const { login, register, verifyToken, getAllUser, updateUser, onOff_video_call, save_profile, delete_profile, userProfileUpdate, getUserProfile, get_saved_profile, fetchBlockList, remove_from_save, diamondMinus, diamondPlus, multiUser, userblock, updateUserCallStatus, fetchAllUser, logOut, AddCoin, fetchDashboardCount } = require("../controllers/User");

const router = express.Router();

// router.post("/login", login);
router.post("/register", register);
router.post("/verify_token", verifyToken);
// router.post("/updateUser", authenticate, updateUser);
// router.post("/getAllUser", getAllUser);
router.post("/logOut", logOut);
router.post("/fetchAllUser", fetchAllUser);
router.post("/AddCoin", AddCoin);
router.post("/updateUserCallStatus", updateUserCallStatus);
router.post("/userblock", userblock);
router.post("/multiUser", multiUser);
router.post("/diamondPlus", diamondPlus);
router.post("/diamondMinus", diamondMinus);
router.post("/remove_from_save", remove_from_save);
router.post("/fetchBlockList", fetchBlockList);
router.post("/get_saved_profile", get_saved_profile);
router.post("/getUserProfile", getUserProfile);
router.post("/userProfileUpdate", userProfileUpdate);
router.post("/delete_profile", delete_profile);
router.post("/save_profile", save_profile);
router.post("/onOff_video_call", onOff_video_call);

//  dashborad api
router.post("/fetchDashboardCount", fetchDashboardCount);

module.exports = router;
