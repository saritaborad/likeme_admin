const express = require("express");
const router = express.Router();

router.use("/", require("./Admin"));
router.use("/", require("./User"));
router.use("/", require("./Ads"));
router.use("/", require("./Agent"));
router.use("/", require("./Country"));
router.use("/", require("./FakeUser"));
router.use("/", require("./Host"));
router.use("/", require("./Gifts"));
router.use("/", require("./FakeUser"));
router.use("/", require("./Image"));
router.use("/", require("./Video"));
router.use("/", require("./Message"));
router.use("/", require("./Notification"));
router.use("/", require("./Pages"));
router.use("/", require("./PaymentGetWay"));
router.use("/", require("./RedeemRequest"));
router.use("/", require("./Report"));
router.use("/", require("./Request"));
router.use("/", require("./Setting"));
router.use("/", require("./Subcription"));
router.use("/", require("./Purchase"));

module.exports = router;
