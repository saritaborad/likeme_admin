const express = require("express");
const { ImageById, videoById, deleteImageById, fetchHostImages, fetchAllImageReview, acceptImageReview, rejectImageReview } = require("../controllers/Image");
const router = express.Router();

router.post("/ImageById", ImageById);
router.post("/deleteImageById", deleteImageById);
router.post("/fetchHostImages", fetchHostImages);
router.post("/fetchAllImageReview", fetchAllImageReview);
router.post("/acceptImageReview", acceptImageReview);
router.post("/rejectImageReview", rejectImageReview);

module.exports = router;
