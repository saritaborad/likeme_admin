const express = require("express");
const { fetchAllSpendHistory, fetchAllPurchaseHistory, getPackageName, fetchAllSortPurchased, notiSortPurchased } = require("../controllers/Purchase");
const router = express.Router();

router.post("/fetchAllPurchaseHistory", fetchAllPurchaseHistory);
router.post("/fetchAllSpendHistory", fetchAllSpendHistory);
router.post("/getPackageName", getPackageName);
router.post("/fetchAllSortPurchased", fetchAllSortPurchased);
router.post("/notiSortPurchased", notiSortPurchased);

module.exports = router;
