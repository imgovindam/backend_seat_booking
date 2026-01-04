
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const seedSeats = require("./utils/seedSeats");
const seatRoutes = require("./routes/seatRoutes");



app.use(cors());
app.use(express.json());
app.use("/api", seatRoutes);


// connect database
connectDB().then(() => seedSeats());  // <--- add this
console.log("ENV TEST: ", process.env.MONGO_URI);


app.get("/", (req, res) => {
  res.send("Backend running...");
  
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
