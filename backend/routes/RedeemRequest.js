const express = require("express");
const { fetchPendingRedeems, getRedeemById, placeRedeemRequestAll, placeRedeemRequest, completeRedeem, fetchRedeemRequests, rejectRedeem, fetchRedeems, fetchAllRedeems } = require("../controllers/RedeemRequest");
const checkHeader = require("../middleware/checkHeader");
const { reqired, isValidId } = require("../middleware/validateField");
const router = express.Router();

router.post("/getRedeemById", getRedeemById);
router.post("/completeRedeem", completeRedeem);
router.post("/fetchRedeems", fetchRedeems);
// router.post("/fetchPendingRedeems", fetchPendingRedeems);
// router.post("/fetchCompletedRedeems", fetchCompletedRedeems);
// router.post("/fetchRejectedRedeems", fetchRejectedRedeems);

//---------- android api -------------
router.post("/fetchRedeemRequests", checkHeader, reqired("user_id"), isValidId("user_id"), fetchRedeemRequests);
router.post("/placeRedeemRequest", checkHeader, reqired("user_id", "account_info", "payment_getway_title"), isValidId("user_id"), placeRedeemRequest);
router.post("/placeRedeemRequestAll", checkHeader, placeRedeemRequestAll);
router.post("/fetchAllRedeems", fetchAllRedeems);
router.post("/rejectRedeem", rejectRedeem);

module.exports = router;
