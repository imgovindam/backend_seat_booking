




// // const mongoose = require("mongoose");

// // const seatSchema = new mongoose.Schema({
// //   show: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "Show",
// //     required: true,
// //   },
// //   row: Number,
// //   col: Number,

// //   status: {
// //     type: String,
// //     enum: ["available", "locked", "booked"],
// //     default: "available",
// //   },

// //   lockedBy: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     default: null,
// //   },

// //   bookedBy: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: "User",
// //     default: null,
// //   },

// //   lockedAt: Date,
// // });

// // module.exports = mongoose.model("Seat", seatSchema);



// const mongoose = require("mongoose");

// const seatSchema = new mongoose.Schema({
//   row: {
//     type: Number,
//     required: true,
//   },
//   col: {
//     type: Number,
//     required: true,
//   },
//   seatNumber: {
//     type: String, // "1-1", "2-5" — set in seeder
//   },
//   isBooked: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model("Seat", seatSchema);



const mongoose = require("mongoose");

//  Use the FULL schema — the simple one (row/col/isBooked only)
// breaks everything because getSeats does Seat.find({ show: showId })
// and no seat has a `show` field → always returns []

const seatSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true,              // every seat must belong to a show
  },
  row: {
    type: Number,
    required: true,
  },
  col: {
    type: Number,
    required: true,
  },
  seatNumber: {
    type: String,                // "1-1", "3-7" etc — set in seeder
  },
  status: {
    type: String,
    enum: ["available", "locked", "booked"],
    default: "available",
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  lockedAt: {
    type: Date,
    default: null,
  },
});

// Fast lookup by show
seatSchema.index({ show: 1, row: 1, col: 1 });

module.exports = mongoose.model("Seat", seatSchema);