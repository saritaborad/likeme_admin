const express = require("express");
const { getAdmobData, updateSettingAdmob } = require("../controllers/Ads");
const router = express.Router();

router.post("/getAdmobData", getAdmobData);
router.post("/updateSettingAdmob", updateSettingAdmob);

module.exports = router;
