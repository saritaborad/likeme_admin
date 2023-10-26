const express = require("express");
const { fetchAllReportReson, addReportReson, updateReportReson, deleteReportReson, reportReson } = require("../controllers/ReportReason");
const checkHeader = require("../middleware/checkHeader");
const router = express.Router();

router.post("/fetchAllReportReson", fetchAllReportReson);
router.post("/addReportReson", addReportReson);
router.post("/updateReportReson", updateReportReson);
router.post("/deleteReportReson", deleteReportReson);
router.post("/reportReson", checkHeader, reportReson);

module.exports = router;
