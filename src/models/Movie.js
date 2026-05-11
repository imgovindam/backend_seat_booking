const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  duration: Number,

  poster: { type: String }, // image URL
  genre: { type: String },
  language: { type: String },
  rating: { type: Number },
  releaseDate: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Movie", movieSchema);
