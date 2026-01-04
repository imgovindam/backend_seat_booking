


const express = require("express");
const router = express.Router();
const { getSeats ,bookSeat,unbookSeat} = require("../controllers/seatController");  
router.get("/seats", getSeats);
router.post("/seats/book", bookSeat);
router.patch("/seats/unbook", unbookSeat);




module.exports=router

// const express = require("express");




