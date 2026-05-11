const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  showTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    default: 200,
  },
  city:{
    type:String,
    required:true,
  },
  theatre: String,
  screen: String,
  // availableSeats: Number,
});

module.exports = mongoose.model("Show", showSchema);
