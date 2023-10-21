const express = require("express");
const { login, logout, addRelationalDB, addNormalDB, changeArrOfDb } = require("../controllers/Admin");
const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/addRelationalDB", addRelationalDB);
router.post("/addNormalDB", addNormalDB);
router.post("/changeArrOfDb", changeArrOfDb);

module.exports = router;
