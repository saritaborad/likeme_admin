const express = require("express");
const { deleteVideoById, videoById, fetchHostVideos, acceptVideoReview, fetchAllVideoReview, rejectVideoReview } = require("../controllers/Video");

const router = express.Router();

router.post("/deleteVideoById", deleteVideoById);
router.post("/videoById", videoById);
router.post("/fetchHostVideos", fetchHostVideos);
router.post("/fetchAllVideoReview", fetchAllVideoReview);
router.post("/acceptVideoReview", acceptVideoReview);
router.post("/rejectVideoReview", rejectVideoReview);

module.exports = router;
