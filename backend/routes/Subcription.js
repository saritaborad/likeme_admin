const express = require("express");
const { fetchAllCoinPlans, addSubcription, subcriptionById, updateSubcription, deleteSubcriptionById, allSubcription, default_flag } = require("../controllers/Subcription");
const checkHeader = require("../middleware/checkHeader");
const router = express.Router();

router.post("/fetchAllCoinPlans", fetchAllCoinPlans);
router.post("/addSubcription", addSubcription);
router.post("/subcriptionById", subcriptionById);
router.post("/updateSubcription", updateSubcription);
router.post("/deleteSubcriptionById", deleteSubcriptionById);
router.post("/allSubcription", checkHeader, allSubcription);
router.post("/default_flag", default_flag);

module.exports = router;
