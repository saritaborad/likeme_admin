const express = require("express");
const router = express.Router();
const { fetchHost_name, fetchHost_historyAPI, get_host_profile, fetchHostProfiles, hostProfileUpdate, hostDetail, hostblock, makeHost, fetchHosts_agent, fetchHosts, fetchAllFakeHost, hostById, applyForHost, fetchAllHost_historyExport, fetchAgentSubtotal, fetchPayout, fetchHostWorkhistory, featureUpdate, blockUnblockHost, addHostImages, addHostVideos, deleteHostById, hostUpdate, fetchHostProfiles_one_to_one, find_random_host, blockHost, unblockHost, get_host_profile_one_to_one, fetchHostProfilesNew } = require("../controllers/Host");
const { uploadImage, uploadVideo } = require("../middleware/upload");
const { fetchAllHost_historyApi } = require("../controllers/AgentHost");
const { reqired, isValidId } = require("../middleware/validateField");
const checkHeader = require("../middleware/checkHeader");

router.post("/fetchHost_name", fetchHost_name);
router.post("/fetchHost_historyAPI", fetchHost_historyAPI);

router.post("/get_host_profile", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), get_host_profile);
router.post("/blockUnblockHost", blockUnblockHost);
router.post("/fetchHostProfiles", checkHeader, reqired("user_id"), isValidId("user_id"), fetchHostProfiles);
router.post("/hostProfileUpdate", hostProfileUpdate);
router.post("/hostDetail", hostDetail);
router.post("/hostblock", hostblock);
router.post("/makeHost", makeHost);
router.post("/fetchHosts_agent", fetchHosts_agent);

router.post("/fetchHosts", fetchHosts);
router.post("/fetchAllFakeHost", fetchAllFakeHost);
router.post("/deleteHostById", deleteHostById);
router.post("/featureUpdate", featureUpdate);
router.post("/addHostImages", uploadImage.array("images"), addHostImages);
router.post("/addHostVideos", uploadVideo.array("video"), addHostVideos);
router.post("/hostUpdate", hostUpdate);

router.post("/hostById", hostById);
router.post("/applyForHost", uploadImage.any(), checkHeader, reqired("id", "availabiltyHours", "billingAddress", "intrests", "about", "age", "email", "country_id", "diamond_per_min", "fullName"), isValidId("id", "country_id"), applyForHost);
router.post("/fetchAllHost_historyExport", fetchAllHost_historyExport);
router.post("/fetchHostWorkhistory", fetchHostWorkhistory);
router.post("/fetchAgentSubtotal", fetchAgentSubtotal);
router.post("/fetchPayout", fetchPayout);

//  ------------------ android api -----------------
router.post("/fetchHostProfiles_one_to_one", checkHeader, fetchHostProfiles_one_to_one);
router.post("/fetchAllHost_historyApi", checkHeader, reqired("id"), isValidId("id"), fetchAllHost_historyApi);
router.post("/get_host_profile_one_to_one", checkHeader, reqired("host_id"), isValidId("host_id"), get_host_profile_one_to_one);
router.post("/fetchHostProfilesNew", checkHeader, reqired("user_id"), isValidId("user_id"), fetchHostProfilesNew);
router.post("/find_random_host", checkHeader, reqired("user_id"), isValidId("user_id"), find_random_host);
router.post("/blockHost", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), blockHost);
router.post("/unblockHost", checkHeader, reqired("user_id", "host_id"), isValidId("user_id", "host_id"), unblockHost);

module.exports = router;
