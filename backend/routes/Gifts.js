const express = require("express");
const { fetchAllgifts, addGifts, editGift, deleteGift, giftList } = require("../controllers/Gifts");
const { uploadImage } = require("../middleware/upload");
const checkHeader = require("../middleware/checkHeader");
const router = express.Router();

router.post("/fetchAllgifts", fetchAllgifts);
router.post("/addGifts", uploadImage.single("images"), addGifts);
router.post("/editGift", uploadImage.single("images"), editGift);
router.post("/deleteGift", deleteGift);
router.post("/giftList", checkHeader, giftList);

module.exports = router;
