

const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const Show = require("../models/Show");

const LOCK_EXPIRY_MINUTES = 5;
const LOCK_EXPIRY_MS = LOCK_EXPIRY_MINUTES * 60 * 1000;

/* ─────────────────────────────────────────────────────────────
   GET /api/seats/:showId
───────────────────────────────────────────────────────────── */
const getSeats = async (req, res) => {
  try {
    const { showId } = req.params;

    // Auto-expire stale locks before returning
    await Seat.updateMany(
      {
        show: showId,
        status: "locked",
        lockedAt: { $lt: new Date(Date.now() - LOCK_EXPIRY_MS) },
      },
      { $set: { status: "available", lockedAt: null, lockedBy: null } }
    );

    const seats = await Seat.find({ show: showId }).sort({ row: 1, col: 1 });
    return res.status(200).json({ status: 200, seats });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/lock
───────────────────────────────────────────────────────────── */
const lockSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

  console.log("🔐 Full req.user:", req.user);        // what does this print?
    console.log("🔐 req.user.id:", req.user?.id);      // undefined?
    console.log("🔐 req.user._id:", req.user?._id);       // debug — remove after confirming

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, status: "available" },
      {
        $set: {
          status: "locked",
          lockedAt: new Date(),
          lockedBy: req.user?.id ?? null,     // ✅ lowercase .id
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({ status: 400, message: "Seat cannot be locked" });
    }

    return res.status(200).json({ status: 200, message: "Seat locked successfully", seat });
  } catch (err) {
    console.error("Error locking seat:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/book
───────────────────────────────────────────────────────────── */
const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;

    const seat = await Seat.findOneAndUpdate(
      {
        _id: seatId,
        status: "locked",
        lockedBy: req.user?.id ?? null,
      },
      {
        $set: {
          status: "booked",
          lockedAt: null,
          bookedBy: req.user?.id ?? null,
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({
        status: 400,
        message: "Seat must be locked by you before booking",
      });
    }

    return res.status(200).json({ status: 200, message: "Seat booked successfully", seat });
  } catch (err) {
    console.error("Error booking seat:", err);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   PATCH /api/seats/unbook
   ✅ FIX: now handles BOTH locked and booked seats
   Previously only matched status:"booked" so clicking a locked
   seat to deselect it always returned 400
───────────────────────────────────────────────────────────── */
const unbookSeat = async (req, res) => {
  try {
    const { seatId } = req.body;
    const userId = req.user?.id ?? null;

    const seat = await Seat.findOneAndUpdate(
      {
        _id: seatId,
        status: { $in: ["locked", "booked"] },  // ✅ handles both
        $or: [
          { lockedBy: userId },                  // releasing a locked seat
          { bookedBy: userId },                  // releasing a booked seat
        ],
      },
      {
        $set: {
          status: "available",
          lockedAt: null,
          lockedBy: null,
          bookedBy: null,
        },
      },
      { new: true }
    );

    if (!seat) {
      return res.status(400).json({
        status: 400,
        message: "Seat not found or not owned by you",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Seat released successfully",
      seat,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   Cron helper — called every minute from server.js
───────────────────────────────────────────────────────────── */
const unlockExpiredSeats = async () => {
  const expiryTime = new Date(Date.now() - LOCK_EXPIRY_MS);
  await Seat.updateMany(
    { status: "locked", lockedAt: { $lt: expiryTime } },
    { $set: { status: "available", lockedAt: null, lockedBy: null } }
  );
};

module.exports = {
  getSeats,
  lockSeat,
  bookSeat,
  unbookSeat,
  unlockExpiredSeats,
};