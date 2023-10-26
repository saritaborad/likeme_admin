const express = require("express");
const { fetchAllCountry, addCountry, updateCountry, country_list, deleteCountry } = require("../controllers/Country");
const checkHeader = require("../middleware/checkHeader");
const router = express.Router();

router.post("/fetchAllCountry", fetchAllCountry);
router.post("/addCountry", addCountry);
router.post("/updateCountry", updateCountry);
router.post("/deleteCountry", deleteCountry);
router.post("/country_list", checkHeader, country_list);

module.exports = router;
