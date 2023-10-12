const express = require("express");
const { setting, getSettingData, updateSettingApp, all_setting, liveSwitch, updateAdmob, getAdmob } = require("../controllers/Setting");
const router = express.Router();

router.post("/setting", setting);
router.post("/getSettingData", getSettingData);
router.post("/updateSettingApp", updateSettingApp);
router.post("/all_setting", all_setting);

router.post("/getAdmob", getAdmob);
router.post("/updateAdmob", updateAdmob);

router.post("/switch", liveSwitch);
// router.post("/generateAgoraToken", generateAgoraToken);
// router.post("/editAgoraToken", editAgoraToken);
// router.post("/hostChargesUpdate", hostChargesUpdate);

module.exports = router;
