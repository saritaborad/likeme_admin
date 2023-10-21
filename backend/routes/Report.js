const express = require("express");
const { report, deleteReport, fetchReports } = require("../controllers/Report");
const router = express.Router();

router.post("/report", report);
router.post("/deleteReport", deleteReport);
router.post("/fetchReports", fetchReports);

module.exports = router;
