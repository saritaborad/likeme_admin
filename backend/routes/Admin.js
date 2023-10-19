const express = require("express");
const { login, logout, addRelationalDB, addNormalDB, addContryDB } = require("../controllers/Admin");
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/addRelationalDB", addRelationalDB);
router.post("/addNormalDB", addNormalDB);
router.post("/addContryDB", addContryDB);

module.exports = router;
