const express = require("express");
const { fakeUser, addfakeUser, fetchAllFakeUser } = require("../controllers/FakeUser");
const router = express.Router();
const { uploadImage } = require("../middleware/upload");

router.post("/fakeUser", fakeUser);
router.post("/addfakeUser", uploadImage.fields([{ name: "video" }, { name: "images" }]), addfakeUser);
router.post("/fetchAllFakeUser", fetchAllFakeUser);

module.exports = router;
