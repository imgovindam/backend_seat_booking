const express = require("express");
const router  = express.Router();
const {
  createBooking,
  getBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const authenticate = require("../middleware/authMiddleware");

// All booking routes require a logged-in user
// router.post  ("/create",              authenticate, createBooking);
router.post("/create", createBooking);
router.get   ("/my-bookings",         authenticate, getMyBookings);
// router.get   ("/:bookingId",          authenticate, getBooking);
router.get   ("/:bookingId",           getBooking);
router.patch ("/:bookingId/cancel",   authenticate, cancelBooking);

module.exports = router;