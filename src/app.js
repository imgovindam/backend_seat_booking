require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const connectDB = require("./db");

const seedSeats = require("./utils/seedSeats");
const seedMovies = require("./utils/seedMovies");
const seedShows = require("./utils/seedShows"); 

const seatRoutes = require("./routes/seatRoutes");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const showRoutes = require("./routes/showRoutes");

const { unlockExpiredSeats } = require("./controllers/seatController");

app.use(cors());
app.use(express.json());

app.use("/api", seatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/shows", showRoutes);

// ✅ SINGLE DB CONNECTION
connectDB().then(async () => {
  console.log("✅ DB Connected");

  const Movie = require("./models/Movie");
  const Show = require("./models/Show");
  const Seat = require("./models/Seat");

  const movieCount = await Movie.countDocuments();
  const showCount = await Show.countDocuments();
  const seatCount = await Seat.countDocuments();
  const seatsMissingShowField = await Seat.countDocuments({ show: { $exists: false } });

  if (movieCount === 0) {
    console.log("🌱 Empty DB — seeding movies...");
    await seedMovies();
  }

  if (showCount === 0) {
    console.log("🌱 No shows found — seeding shows...");
    await seedShows();
  }

  const refreshedShowCount = await Show.countDocuments();
  const expectedSeatCount = refreshedShowCount * 50;

  if (
    seatCount === 0 ||
    seatsMissingShowField > 0 ||
    seatCount !== expectedSeatCount
  ) {
    console.log("🌱 Seeding seats because seat data is missing or outdated...");
    await seedSeats();
    console.log("✅ Seats seeded");
  } else {
    console.log("✅ Seats already seeded — skipping");
  }
});

app.get("/", (req, res) => {
  res.send("Backend running...");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

setInterval(() => {
  unlockExpiredSeats();
}, 60 * 1000);





// require("dotenv").config();
// import express, { json } from "express";
// const app = express();
// import cors from "cors";

// import connectDB from "./db";

// import seedMovies from "./utils/seedMovies";
// import seedShows from "./utils/seedShows";
// import seedSeats from "./utils/seedSeats";  // ✅ must run LAST

// import seatRoutes from "./routes/seatRoutes";
// import authRoutes from "./routes/authRoutes";
// import movieRoutes from "./routes/movieRoutes";
// import showRoutes from "./routes/showRoutes";
// import bookingRoutes from "./routes/bookingRoutes";
// import { unlockExpiredSeats } from "./controllers/seatController";

// app.use(cors());
// app.use(json());

// app.use("/api", seatRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/movies", movieRoutes);
// app.use("/api/shows", showRoutes);
// app.use("/api/bookings", bookingRoutes);  

// // ✅ Seed order matters:
// //    1. movies  — no dependencies
// //    2. shows   — depends on movie _ids
// //    3. seats   — depends on show _ids
// connectDB().then(async () => {
//   console.log("✅ DB Connected");

//   await seedMovies();
//   await seedShows();
//   await seedSeats();   // ← now runs AFTER shows exist, seats get show field

//   console.log("✅ Seeding Done");
// });

// app.get("/", (req, res) => res.send("Backend running..."));

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// // Auto-expire locked seats every minute
// setInterval(() => unlockExpiredSeats(), 60 * 1000);
