const express = require("express");
const { terms_conditions, privacy_policy, getPageData, addPageData } = require("../controllers/Pages");
const router = express.Router();

router.post("/addPageData", addPageData);
router.post("/getPageData", getPageData);
router.post("/privacy_policy", privacy_policy);
router.post("/terms_conditions", terms_conditions);

module.exports = router;
