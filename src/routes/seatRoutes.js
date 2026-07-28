


// // const express = require("express");
// // const router = express.Router();
// // const { getSeats ,bookSeat,unbookSeat, lockSeat} = require("../controllers/seatController");  
// // router.get("/seats", getSeats);
// // router.post("/seats/book", bookSeat);
// // router.patch("/seats/unbook", unbookSeat);
// // router.post("/seats/lockSeats",lockSeat)




// // module.exports=router

// // // const express = require("express");

// const express = require("express");
// const router = express.Router();
// const authMiddleware=require("../middleware/authMiddleware")



// const {
//   getSeats,
//   lockSeat,
//   bookSeat,
//   unbookSeat,
// } = require("../controllers/seatController");

// // router.get("/seats", getSeats);
// router.get("/seats/:showId", getSeats);

// router.patch ("/seats/lock",    authMiddleware, lockSeat);  
// router.patch ("/seats/book",    authMiddleware, bookSeat); 
// router.patch("/seats/unbook",authMiddleware, unbookSeat);

// module.exports = router;

const express = require("express");
const router  = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getSeats,
  lockSeat,
  bookSeat,
  unbookSeat,
} = require("../controllers/seatController");

// Public — no auth needed to view seats
router.get  ("/seats/:showId", getSeats);

// Protected — all mutations require login
// ✅ All PATCH — must match seatSlice.js which sends PATCH for all three
// router.patch("/seats/lock",   authMiddleware, lockSeat);
router.patch("/seats/lock",   lockSeat);
router.patch("/seats/book",   authMiddleware, bookSeat);
router.patch("/seats/unbook", authMiddleware, unbookSeat);

module.exports = router;

