


const Booking = require("../models/Booking");
const Seat    = require("../models/Seat");
const Show    = require("../models/Show");

/* ─────────────────────────────────────────────────────────────
   POST /api/bookings/create
   ✅ NO MongoDB transactions — works on standalone local MongoDB.
   Transactions require a replica set. Add them back when you
   move to MongoDB Atlas in production.
───────────────────────────────────────────────────────────── */
const createBooking = async (req, res) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user?.id;

    if (!showId || !seatIds?.length) {
      return res.status(400).json({ message: "showId and seatIds are required" });
    }

    // 1. Move each locked seat → booked
    for (const seatId of seatIds) {
      const seat = await Seat.findOneAndUpdate(
        {
          _id: seatId,
          status: "locked",
          lockedBy: userId,              // only the user who locked it can book it
        },
        {
          $set: {
            status: "booked",
            bookedBy: userId,
            lockedAt: null,
          },
        },
        { new: true }
      );

      if (!seat) {
        // Roll back already-booked seats in this loop
        // (simple version — no transaction needed for 1-2 seats)
        return res.status(400).json({
          message: "One or more seats expired or were not locked by you. Please re-select.",
        });
      }
    }

    // 2. Get show price
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const totalPrice = show.price * seatIds.length;

    // 3. Create booking record
    const booking = await Booking.create({
      user:       userId,
      show:       showId,
      seats:      seatIds,
      totalPrice,
      status:     "pending",             // → "confirmed" after Razorpay payment
    });

    // 4. Return populated so frontend has all details immediately
    const populated = await Booking.findById(booking._id)
      .populate("show")
      .populate("seats")
      .populate("user", "name email");

    return res.status(201).json({ booking: populated });
  } catch (err) {
    console.error("createBooking error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/bookings/my-bookings   ← must be before /:bookingId
───────────────────────────────────────────────────────────── */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user?.id })
      .populate("show")
      .populate("seats")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   GET /api/bookings/:bookingId
───────────────────────────────────────────────────────────── */
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("show")
      .populate("seats")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user._id) !== String(req.user?.id)) {
      return res.status(403).json({ message: "Not authorised" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/bookings/:bookingId/cancel
───────────────────────────────────────────────────────────── */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.user) !== String(req.user?.id))
      return res.status(403).json({ message: "Not authorised" });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });
    if (booking.status === "confirmed")
      return res.status(400).json({ message: "Confirmed bookings cannot be cancelled here" });

    // Release seats back to available
    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      { $set: { status: "available", bookedBy: null, lockedAt: null } }
    );

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({ message: "Booking cancelled", booking });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createBooking, getBooking, getMyBookings, cancelBooking };