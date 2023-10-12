const express = require("express");
const { fetchHostImages, fetchHostVideos, MakeHost, fetchHostApplications, viewHost, requestUserById, RejectHost, deleteImageById, deleteVideoById, hostUpdate } = require("../controllers/Request");
const router = express.Router();

// router.post("/fetchHostImages", fetchHostImages);
// router.post("/fetchHostVideos", fetchHostVideos);
router.post("/MakeHost", MakeHost);
router.post("/fetchHostApplications", fetchHostApplications);
router.post("/viewHost", viewHost);
router.post("/requestUserById", requestUserById);
router.post("/RejectHost", RejectHost);

module.exports = router;
