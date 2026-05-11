// const Movie = require("../models/Movie");
// const Show = require("../models/Show");

// const seedShows = async () => {
//   await Show.deleteMany();

//   const movies = await Movie.find();

//   if (!movies.length) {
//     console.log("No movies found");
//     return;
//   }

//   const shows = [];

//   movies.forEach((movie) => {
//     shows.push(
//       {
//         movie: movie._id, // ✅ REAL ID
//         showTime: new Date(),
//         price: 250,
//         city: "Bangalore",
//         theatre: "PVR Koramangala",
//       },
//       {
//         movie: movie._id,
//         showTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
//         price: 300,
//         city: "Delhi",
//         theatre: "INOX",
//       }
//     );
//   });

//   await Show.insertMany(shows);

//   console.log("Shows seeded properly");
// };

// module.exports = seedShows;



const Movie = require("../models/Movie");
const Show = require("../models/Show");

const cities = ["Bangalore", "Delhi", "Mumbai"];

const theatres = {
  Bangalore: ["PVR Koramangala", "INOX Garuda", "Cinepolis Orion"],
  Delhi: ["INOX", "PVR Saket", "Cinepolis Delhi"],
  Mumbai: ["PVR Andheri", "INOX Nariman", "Cinepolis Mumbai"],
};

const showTimes = [
  10 * 60 * 60 * 1000, // morning
  14 * 60 * 60 * 1000, // afternoon
  18 * 60 * 60 * 1000, // evening
  21 * 60 * 60 * 1000, // night
];

const seedShows = async () => {
  await Show.deleteMany();

  const movies = await Movie.find();

  if (!movies.length) {
    console.log("No movies found");
    return;
  }

  const shows = [];

  movies.forEach((movie) => {
    cities.forEach((city) => {
      theatres[city].forEach((theatre) => {
        showTimes.forEach((timeOffset) => {
          shows.push({
            movie: movie._id,
            showTime: new Date(Date.now() + timeOffset),
            price: Math.floor(Math.random() * 200) + 150, // ₹150–₹350
            city,
            theatre,
          });
        });
      });
    });
  });

  await Show.insertMany(shows);

  console.log(" Shows seeded like real app ");
};

module.exports = seedShows;