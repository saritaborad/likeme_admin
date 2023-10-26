const express = require("express");
const { report, deleteReport, fetchReports } = require("../controllers/Report");
const { reqired, isValidId } = require("../middleware/validateField");
const checkHeader = require("../middleware/checkHeader");
const router = express.Router();

router.post("/report", checkHeader, reqired("user_id", "reason", "description"), isValidId("user_id"), report);
router.post("/deleteReport", deleteReport);
router.post("/fetchReports", fetchReports);

module.exports = router;
