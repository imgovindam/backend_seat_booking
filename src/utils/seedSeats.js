// const Seat = require("../models/Seat");

// const seedSeats = async () => {
//   const existing = await Seat.countDocuments();
//   if (existing > 0) return; // do not re-seed

//   let seats = [];
//   for (let r = 1; r <= 5; r++) {
//     for (let c = 1; c <= 10; c++) {
//       seats.push({ row: r, col: c });
//     }
//   }

//   await Seat.insertMany(seats);
//   console.log("Seats created!");
// };

// module.exports = seedSeats;



const Seat = require("../models/Seat");
const Show = require("../models/Show");

const seedSeats = async () => {
  try {
   
    await Seat.deleteMany();

    const shows = await Show.find({});

    if (shows.length === 0) {
      console.log("⚠️  No shows found — run seedShows first");
      return;
    }

    const seats = [];

    shows.forEach((show) => {
      for (let r = 1; r <= 5; r++) {
        for (let c = 1; c <= 10; c++) {
          seats.push({
            show: show._id,        // ✅ the missing link
            row: r,
            col: c,
            seatNumber: `${r}-${c}`,
            status: "available",
            lockedBy: null,
            bookedBy: null,
            lockedAt: null,
          });
        }
      }
    });

    await Seat.insertMany(seats);
    console.log(`✅ ${seats.length} seats seeded (50 per show × ${shows.length} shows)`);
  } catch (err) {
    console.error("❌ Error seeding seats:", err);
  }
};

module.exports = seedSeats;