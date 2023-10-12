const express = require("express");
const { fetchAllPayment, addPayment, updatePayment, deletePaymentById, PaymentGetWayList } = require("../controllers/PaymentGetWay");
const router = express.Router();

router.post("/fetchAllPayment", fetchAllPayment);
router.post("/addPayment", addPayment);
router.post("/updatePayment", updatePayment);
router.post("/deletePaymentById", deletePaymentById);
router.post("/PaymentGetWayList", PaymentGetWayList);

module.exports = router;
