const express = require("express");
const { fakeMessagesList, deleteMessageById, updateMessage, fetchAllMessages, addMessage } = require("../controllers/Message");
const { uploadImage } = require("../middleware/upload");
const router = express.Router();

router.post("/fetchAllMessages", fetchAllMessages);
router.post("/addMessage", uploadImage.single("title"), addMessage);
router.post("/fakeMessagesList", fakeMessagesList);
router.post("/deleteMessageById", deleteMessageById);
router.post("/updateMessage", updateMessage);

module.exports = router;
