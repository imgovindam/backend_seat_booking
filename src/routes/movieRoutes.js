const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

module.exports = router;
