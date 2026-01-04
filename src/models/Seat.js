const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  row: Number,
  col: Number,
  isBooked: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
});

module.exports = mongoose.model("Seat", seatSchema);
