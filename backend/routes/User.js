const express = require("express");
const { login, register, verifyToken, onOff_video_call, save_profile, delete_profile, userProfileUpdate, getUserProfile, get_saved_profile, fetchBlockList, remove_from_save, diamondMinus, diamondPlus, multiUser, userblock, updateUserCallStatus, fetchAllUser, logOut, AddCoin, fetchDashboardCount, fetchAgentDashboard, interestedCountry, userlanguage, getFast, userVersionUpdate, listOrder, diamondUpdate, host_live_stream_track, host_live_stream_track_history, host_live_stream_track_history_list } = require("../controllers/User");
const { reqired, isValidId } = require("../middleware/validateField");
const checkHeader = require("../middleware/checkHeader");
const { uploadImage } = require("../middleware/upload");
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
router.post("/remove_from_save", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), remove_from_save);
router.post("/get_saved_profile", checkHeader, reqired("user_id"), isValidId("user_id"), get_saved_profile);
router.post("/getUserProfile", checkHeader, reqired("user_id"), isValidId("user_id"), getUserProfile);
router.post("/delete_profile", checkHeader, reqired("user_id"), isValidId("user_id"), delete_profile);
router.post("/save_profile", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), save_profile);
router.post("/onOff_video_call", onOff_video_call);

//  dashborad api
router.post("/fetchDashboardCount", fetchDashboardCount);
router.post("/fetchAgentDashboard", fetchAgentDashboard);

// -------- android api --------------

router.post("/getFast", checkHeader, reqired("device_id"), getFast);
router.post("/userProfileUpdate", checkHeader, uploadImage.single("profileimages"), reqired("user_id", "fullName"), isValidId("user_id"), userProfileUpdate);
router.post("/userVersionUpdate", checkHeader, reqired("user_id", "version"), isValidId("user_id"), userVersionUpdate);

router.post("/interestedCountry", checkHeader, reqired("user_id", "country_list"), isValidId("user_id"), interestedCountry);
router.post("/userlanguage", checkHeader, reqired("user_id", "language"), isValidId("user_id"), userlanguage);

router.post("/diamondPluse", checkHeader, reqired("user_id", "diamond", "type"), isValidId("user_id"), diamondPlus);
router.post("/diamondMinus", checkHeader, reqired("user_id", "host_id", "diamond", "spend_type"), isValidId("user_id", "host_id"), diamondMinus);
router.post("/diamondUpdate", checkHeader, reqired("user_id", "genrated_id", "diamond", "sku", "purchase_token"), isValidId("user_id", "genrated_id"), diamondUpdate);
router.post("/listOrder", checkHeader, reqired("user_id"), isValidId("user_id"), listOrder);
router.post("/fetchBlockList", checkHeader, reqired("user_id"), isValidId("user_id"), fetchBlockList);

router.post("/host_live_stream_track", checkHeader, reqired("host_id", "event", "session"), isValidId("host_id"), host_live_stream_track);
router.post("/host_live_stream_track_history", checkHeader, reqired("host_id"), isValidId("host_id"), host_live_stream_track_history);
router.post("/host_live_stream_track_history_list", checkHeader, reqired("host_id", "from", "to"), isValidId("host_id"), host_live_stream_track_history_list);

module.exports = router;
