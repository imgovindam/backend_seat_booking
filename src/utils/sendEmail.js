const nodemailer = require("nodemailer");

// Gmail SMTP — requires an "App Password", not your regular Gmail password.
// Generate one at https://myaccount.google.com/apppasswords (needs 2FA enabled).
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail = async ({ to, userName, movieTitle, theatre, showTime, seatLabels, amount, bookingId }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 24px; color: #fff;">
        <h2 style="margin: 0;">🎟️ Booking Confirmed</h2>
      </div>
      <div style="padding: 24px; color: #222;">
        <p>Hi ${userName || "there"},</p>
        <p>Your seats are booked! Here are your details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0; color: #666;">Movie</td><td style="text-align:right; font-weight:bold;">${movieTitle}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Theatre</td><td style="text-align:right;">${theatre}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Show Time</td><td style="text-align:right;">${new Date(showTime).toLocaleString()}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Seats</td><td style="text-align:right;">${seatLabels.join(", ")}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Amount Paid</td><td style="text-align:right; font-weight:bold;">₹${amount}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Booking ID</td><td style="text-align:right; font-size: 12px;">${bookingId}</td></tr>
        </table>
        <p style="color: #888; font-size: 13px;">Please arrive at least 15 minutes before showtime. Enjoy the movie!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"CineBook" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed — ${movieTitle}`,
    html,
  });
};

module.exports = { sendBookingEmail };