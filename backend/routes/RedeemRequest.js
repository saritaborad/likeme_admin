const express = require("express");
const { fetchPendingRedeems, getRedeemById, placeRedeemRequestAll, placeRedeemRequest, completeRedeem, fetchRedeemRequests, rejectRedeem, fetchRedeems, fetchAllRedeems } = require("../controllers/RedeemRequest");
const router = express.Router();

router.post("/getRedeemById", getRedeemById);
router.post("/placeRedeemRequestAll", placeRedeemRequestAll);
router.post("/placeRedeemRequest", placeRedeemRequest);
router.post("/completeRedeem", completeRedeem);
router.post("/fetchRedeems", fetchRedeems);
// router.post("/fetchPendingRedeems", fetchPendingRedeems);
// router.post("/fetchCompletedRedeems", fetchCompletedRedeems);
// router.post("/fetchRejectedRedeems", fetchRejectedRedeems);
router.post("/fetchRedeemRequests", fetchRedeemRequests);
router.post("/fetchAllRedeems", fetchAllRedeems);
router.post("/rejectRedeem", rejectRedeem);

module.exports = router;
