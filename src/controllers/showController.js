const Show = require("../models/Show");
const mongoose = require("mongoose");

const getShows = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { city } = req.query;

    console.log("movieId:", movieId);
    console.log("city:", city);

    const query = {
      movie: new mongoose.Types.ObjectId(movieId),
    };

    if (city) {
      query.city = city;
    }

    const shows = await Show.find(query);

    console.log("FOUND SHOWS:", shows.length);

    res.status(200).json({ shows });
  } catch (err) {
    console.error("Error fetching shows:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getShows };