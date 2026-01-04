const Seat = require("../models/Seat");

const seedSeats = async () => {
  const existing = await Seat.countDocuments();
  if (existing > 0) return; // do not re-seed

  let seats = [];
  for (let r = 1; r <= 5; r++) {
    for (let c = 1; c <= 10; c++) {
      seats.push({ row: r, col: c });
    }
  }

  await Seat.insertMany(seats);
  console.log("Seats created!");
};

module.exports = seedSeats;
