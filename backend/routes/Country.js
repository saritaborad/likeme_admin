const express = require("express");
const { fetchAllCountry, addCountry, updateCountry, country_list, deleteCountry } = require("../controllers/Country");
const router = express.Router();

router.post("/fetchAllCountry", fetchAllCountry);
router.post("/addCountry", addCountry);
router.post("/updateCountry", updateCountry);
router.post("/deleteCountry", deleteCountry);
router.post("/country_list", country_list);

module.exports = router;
