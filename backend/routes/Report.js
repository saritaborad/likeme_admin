const express = require("express");
const { report, deleteReport, fetchReports, fetchAllReportReson, addReportReson, updateReportReson, deleteReportReson, reportReson } = require("../controllers/Report");
const router = express.Router();

router.post("/report", report);
router.post("/deleteReport", deleteReport);
router.post("/fetchReports", fetchReports);
router.post("/fetchAllReportReson", fetchAllReportReson);
router.post("/addReportReson", addReportReson);
router.post("/updateReportReson", updateReportReson);
router.post("/deleteReportReson", deleteReportReson);
router.post("/reportReson", reportReson);

module.exports = router;
