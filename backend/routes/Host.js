const express = require("express");
const { fetchHost_name, fetchHost_historyAPI, get_host_profile, fetchHostProfiles, hostProfileUpdate, hostDetail, hostblock, makeHost, fetchHosts_agent, fetchHosts, fetchAllFakeHost, hostById, applyForHost, fetchAllHost_historyExport, fetchAgentSubtotal, fetchPayout, fetchHostWorkhistory, featureUpdate, blockUnblockHost, addHostImages, addHostVideos, deleteHostById, hostUpdate } = require("../controllers/Host");
const { uploadImage, uploadVideo } = require("../middleware/upload");
const router = express.Router();

router.post("/fetchHost_name", fetchHost_name);
router.post("/fetchHost_historyAPI", fetchHost_historyAPI);
// router.post("/unblockHost", unblockHost);
// router.post("/blockHost", blockHost);

router.post("/get_host_profile", get_host_profile);
router.post("/blockUnblockHost", blockUnblockHost);
router.post("/fetchHostProfiles", fetchHostProfiles);
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
router.post("/applyForHost", applyForHost);
router.post("/fetchAllHost_historyExport", fetchAllHost_historyExport);
router.post("/fetchHostWorkhistory", fetchHostWorkhistory);
router.post("/fetchAgentSubtotal", fetchAgentSubtotal);
router.post("/fetchPayout", fetchPayout);

module.exports = router;
