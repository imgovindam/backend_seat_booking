const Razorpay = require("razorpay");
const crypto = require("crypto");

const Show = require("../models/Show");
const Seat = require("../models/Seat");
const Booking = require("../models/Booking");
const { sendBookingEmail } = require("../utils/sendEmail");


console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET:",
  process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "Missing"
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ─────────────────────────────────────────────────────────────
   POST /api/payment/create-order
   body: { showId, seatIds }
───────────────────────────────────────────────────────────── */
const createOrder = async (req, res) => {
  try {
    const { showId, seatIds, guestName, guestEmail } = req.body;

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({ message: "showId and seatIds are required" });
    }

    if (!guestEmail) {
      return res.status(400).json({ message: "Email is required to confirm your booking" });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // ✅ Amount is computed server-side from the show price — never trust
    // an amount sent by the client, or someone could pay less than owed.
    const amount = show.price * seatIds.length * 100; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    // Create a "pending" booking now so we have a record even if the
    // user closes the checkout modal before paying.
    const booking = await Booking.create({
      user: req.user?.id, // present once you add auth back; undefined for guests
      guestName,
      guestEmail,
      show: showId,
      seats: seatIds,
      totalPrice: amount / 100,
      razorpayOrderId: order.id,
      status: "pending",
    });

    return res.status(200).json({
      order,
      bookingId: booking._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────────
   POST /api/payment/verify
   body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }
───────────────────────────────────────────────────────────── */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ Verify the payment is genuine using Razorpay's signature scheme
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      booking.status = "cancelled";
      await booking.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Mark seats as booked
    await Seat.updateMany(
      { _id: { $in: booking.seats }, status: "locked" },
      {
        $set: {
          status: "booked",
          bookedBy: booking.user ?? null,
          lockedAt: null,
        },
      }
    );

    booking.status = "confirmed";
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    // Send confirmation email (best-effort — don't fail the booking if email fails)
    try {
      const [show, seats] = await Promise.all([
        Show.findById(booking.show).populate("movie"),
        Seat.find({ _id: { $in: booking.seats } }),
      ]);

      const seatLabels = seats.map((s) => s.seatNumber ?? `${s.row}-${s.col}`);

      await sendBookingEmail({
        to: booking.guestEmail,
        userName: booking.guestName,
        movieTitle: show?.movie?.title ?? "Your Movie",
        theatre: show?.theatre ?? "Theatre",
        showTime: show?.showTime,
        seatLabels,
        amount: booking.totalPrice,
        bookingId: booking._id,
      });
    } catch (emailErr) {
      console.error("⚠️  Booking succeeded but email failed:", emailErr);
    }

    return res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, verifyPayment };