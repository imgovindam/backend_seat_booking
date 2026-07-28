const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../controllers/PaymentController");

// No auth required for now — guest checkout using name/email collected
// on the payment page. Add authMiddleware back here once login is required.
router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;